/** Max width/height for stored images (px). Larger images are resized down. */
const MAX_DIMENSION = 1500;
/** JPEG quality for non-transparent images (0–1). */
const JPEG_QUALITY = 0.82;

/**
 * Converts a File to a compressed base64 data URL.
 * - Resizes so the longest side ≤ MAX_DIMENSION (preserves aspect ratio)
 * - PNG files with potential transparency are kept as PNG (lossless)
 * - Everything else (JPEG, WEBP, BMP…) is re-encoded as JPEG at JPEG_QUALITY
 *
 * Typical savings: a 3 MB phone photo becomes ≈ 120–250 KB.
 */
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Compute new dimensions (keep aspect ratio)
      let { naturalWidth: w, naturalHeight: h } = img;
      if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
        if (w >= h) { h = Math.round(h * MAX_DIMENSION / w); w = MAX_DIMENSION; }
        else         { w = Math.round(w * MAX_DIMENSION / h); h = MAX_DIMENSION; }
      }

      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }

      ctx.drawImage(img, 0, 0, w, h);

      // Keep PNG for transparency; use JPEG for everything else
      const isPng     = file.type === 'image/png';
      const mimeType  = isPng ? 'image/png' : 'image/jpeg';
      const quality   = isPng ? undefined : JPEG_QUALITY;

      resolve(canvas.toDataURL(mimeType, quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = objectUrl;
  });
}

export function isBase64Image(src: string): boolean {
  return src.startsWith('data:image/');
}
