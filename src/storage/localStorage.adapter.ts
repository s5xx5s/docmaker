import type { StorageAdapter } from '../types';

export class LocalStorageAdapter implements StorageAdapter {
  async upload(file: File, path?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const key = path ?? `dm_file_${Date.now()}_${file.name}`;
        try {
          localStorage.setItem(key, base64);
          resolve(base64);
        } catch {
          reject(new Error('localStorage quota exceeded'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  async download(path: string): Promise<Blob> {
    const data = localStorage.getItem(path);
    if (!data) throw new Error(`File not found: ${path}`);
    const res = await fetch(data);
    return res.blob();
  }

  async delete(path: string): Promise<void> {
    localStorage.removeItem(path);
  }

  async list(prefix?: string): Promise<string[]> {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (!prefix || key.startsWith(prefix))) {
        keys.push(key);
      }
    }
    return keys;
  }
}
