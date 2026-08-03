import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { renderPdfThumbnail } from './pdf-thumbnail';

@Injectable()
export class ThumbnailService {
  constructor(private supabase: SupabaseService) {}

  /**
   * Renders the first page of a PDF and uploads the thumbnail to Supabase.
   * Returns the public URL of the thumbnail, or null when rendering/uploading fails.
   */
  async generateAndUpload(pdfBuffer: Buffer, sourceFileName: string): Promise<string | null> {
    try {
      const png = await renderPdfThumbnail(pdfBuffer);
      if (!png) return null;

      const base = sourceFileName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.pdf$/i, '');
      return this.supabase.upload(png, `${base}-thumb.png`, 'image/png');
    } catch {
      return null;
    }
  }
}
