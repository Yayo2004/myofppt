import { createCanvas, DOMMatrix, Path2D } from '@napi-rs/canvas';
import * as path from 'path';

// pdf.js in Node needs DOMMatrix/Path2D globals. @napi-rs/canvas provides
// spec-compliant implementations, so we wire them up before loading pdf.js.
(globalThis as any).DOMMatrix = DOMMatrix;
(globalThis as any).Path2D = Path2D;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js') as any;

const MAX_WIDTH = 360;
const MAX_HEIGHT = 600;

// pdf.js creates internal canvases (e.g. for path/Type3 fonts); in Node the
// default factory tries to `require("canvas")`. We provide our own using
// @napi-rs/canvas so no node-canvas dependency is needed.
const canvasFactory = {
  create(width: number, height: number) {
    const canvas = createCanvas(width, height);
    return { canvas, context: canvas.getContext('2d') };
  },
  reset(canvasAndContext: any, width: number, height: number) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },
  destroy(canvasAndContext: any) {
    if (canvasAndContext.canvas) {
      canvasAndContext.canvas.width = 0;
      canvasAndContext.canvas.height = 0;
    }
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

const standardFontDataUrl =
  path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'standard_fonts') + path.sep;

/**
 * Renders the first page of a PDF buffer to a PNG buffer.
 * Returns null if the buffer is not a renderable PDF.
 */
export async function renderPdfThumbnail(pdfBuffer: Buffer): Promise<Buffer | null> {
  let doc: any;
  try {
    doc = await pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      canvasFactory,
      standardFontDataUrl,
      isEvalSupported: false,
      useSystemFonts: true,
      verbosity: 0,
    }).promise;

    const page = await doc.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const scale = Math.min(1, MAX_WIDTH / base.width, MAX_HEIGHT / base.height);
    const viewport = page.getViewport({ scale });

    const canvas = createCanvas(
      Math.max(1, Math.floor(viewport.width)),
      Math.max(1, Math.floor(viewport.height)),
    );
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;

    return canvas.toBuffer('image/png');
  } catch {
    return null;
  } finally {
    if (doc) await doc.destroy().catch(() => {});
  }
}
