import type { StorageAdapter, SupabaseConfig } from '../types';

// Supabase adapter — يتطلب @supabase/supabase-js (اختياري)
export class SupabaseAdapter implements StorageAdapter {
  constructor(private readonly config: SupabaseConfig) {}

  async upload(_file: File, _path?: string): Promise<string> {
    throw new Error(
      'SupabaseAdapter: install @supabase/supabase-js and implement this method. ' +
      'See docs/STORAGE.md for implementation guide.'
    );
  }

  async download(_path: string): Promise<Blob> {
    throw new Error('SupabaseAdapter: not implemented. See docs/STORAGE.md.');
  }

  async delete(_path: string): Promise<void> {
    throw new Error('SupabaseAdapter: not implemented. See docs/STORAGE.md.');
  }

  async list(_prefix?: string): Promise<string[]> {
    throw new Error('SupabaseAdapter: not implemented. See docs/STORAGE.md.');
  }

  getBucket(): string {
    return this.config.bucket;
  }
}
