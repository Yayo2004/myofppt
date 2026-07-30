import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client!: SupabaseClient;
  private bucketName = 'documents';

  onModuleInit() {
    this.client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );
    this.ensureBucket();
  }

  private async ensureBucket() {
    const { data: buckets } = await this.client.storage.listBuckets();
    if (!buckets?.find((b) => b.name === this.bucketName)) {
      await this.client.storage.createBucket(this.bucketName, {
        public: true,
      });
    }
    const { error: updateError } = await this.client.storage.updateBucket(this.bucketName, {
      public: true,
    });
    if (updateError) console.error('Failed to set bucket public:', updateError.message);
  }

  async upload(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const unique = `${Date.now()}-${safe}`;
    const { data, error } = await this.client.storage
      .from(this.bucketName)
      .upload(unique, buffer, {
        contentType: mimeType,
        upsert: true,
      });
    if (error) throw error;

    const { data: urlData } = await this.client.storage
      .from(this.bucketName)
      .getPublicUrl(unique);
    return urlData.publicUrl;
  }

  async delete(fileUrl: string) {
    const path = fileUrl.split('/').pop();
    if (!path) return;
    await this.client.storage.from(this.bucketName).remove([path]);
  }
}
