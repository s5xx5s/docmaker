// ── Storage Types ─────────────────────────────────────────────────────────────

export type StorageType = 'local' | 's3' | 'supabase' | 'custom';

export interface S3Config {
  bucket: string;
  region: string;
  accessKey: string;
  secretKey: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  bucket: string;
}

export interface StorageConfig {
  type: StorageType;
  s3?: S3Config;
  supabase?: SupabaseConfig;
  custom?: {
    uploadFn: (file: File) => Promise<string>;
  };
}

export interface StorageAdapter {
  upload(file: File, path?: string): Promise<string>;
  download(path: string): Promise<Blob>;
  delete(path: string): Promise<void>;
  list(prefix?: string): Promise<string[]>;
}
