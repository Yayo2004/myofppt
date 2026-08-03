import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { renderPdfThumbnail } from '../src/thumbnails/pdf-thumbnail';

// Node 20.12+ loads .env without extra deps
if (typeof process.loadEnvFile === 'function') process.loadEnvFile();

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

async function uploadThumbnail(buffer: Buffer, fileName: string): Promise<string> {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const unique = `${Date.now()}-${safe}`;
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(unique, buffer, { contentType: 'image/png', upsert: true });
  if (error) throw error;
  const { data: urlData } = await supabase.storage
    .from('documents')
    .getPublicUrl(unique);
  return urlData.publicUrl;
}

async function main() {
  const stats = { scanned: 0, generated: 0, failed: 0, skipped: 0 };
  let offset = 0;
  const pageSize = 25;

  for (;;) {
    const docs = await prisma.document.findMany({
      where: {
        fileType: 'pdf',
        OR: [{ thumbnailUrl: null }, { thumbnailUrl: '' }],
      },
      orderBy: { id: 'asc' },
      take: pageSize,
      skip: offset,
      select: { id: true, title: true, storageUrl: true, fileName: true },
    });

    if (!docs.length) break;

    for (const doc of docs) {
      stats.scanned++;
      try {
        const res = await fetch(doc.storageUrl);
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        const pdf = Buffer.from(await res.arrayBuffer());
        const png = await renderPdfThumbnail(pdf);
        if (!png) throw new Error('render failed');

        const thumbnailUrl = await uploadThumbnail(png, `${doc.fileName.replace(/\.pdf$/i, '')}-thumb.png`);
        await prisma.document.update({
          where: { id: doc.id },
          data: { thumbnailUrl },
        });
        stats.generated++;
        console.log(`+ ${doc.title}`);
      } catch (err) {
        stats.failed++;
        console.error(`x ${doc.title}: ${(err as Error).message}`);
      }
    }

    offset += pageSize;
  }

  console.log(`\nDone: ${stats.generated} generated, ${stats.failed} failed, ${stats.skipped} skipped, ${stats.scanned} scanned`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
