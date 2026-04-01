import type { StorageAdapter, S3Config } from '../types';

// S3 adapter — يتطلب credentials من المطور
// الرفع يتم عبر presigned URL أو AWS SDK
export class S3Adapter implements StorageAdapter {
  constructor(private readonly config: S3Config) {}

  async upload(_file: File, _path?: string): Promise<string> {
    throw new Error(
      'S3Adapter: configure a presigned URL endpoint or use AWS SDK. ' +
      'See docs/STORAGE.md for implementation guide.'
    );
  }

  async download(_path: string): Promise<Blob> {
    throw new Error('S3Adapter: not implemented. See docs/STORAGE.md.');
  }

  async delete(_path: string): Promise<void> {
    throw new Error('S3Adapter: not implemented. See docs/STORAGE.md.');
  }

  async list(_prefix?: string): Promise<string[]> {
    throw new Error('S3Adapter: not implemented. See docs/STORAGE.md.');
  }

  getBucket(): string {
    return this.config.bucket;
  }

  getRegion(): string {
    return this.config.region;
  }
}
