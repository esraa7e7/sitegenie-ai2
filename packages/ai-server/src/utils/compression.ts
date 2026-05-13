import { gzipSync, gunzipSync } from 'fflate';

/**
 * Compresses a string or object into a Gzipped Buffer.
 */
export function compress(data: string | object): Buffer {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  const buf = Buffer.from(content, 'utf8');
  return Buffer.from(gzipSync(new Uint8Array(buf)));
}

/**
 * Decompresses a Gzipped Buffer back into its original form.
 */
export function decompress(buffer: Buffer | Uint8Array): string {
  const decompressed = gunzipSync(new Uint8Array(buffer));
  return Buffer.from(decompressed).toString('utf8');
}

/**
 * Calculates approximately how much space is saved.
 */
export function getCompressionStats(original: string, compressed: Buffer) {
  const originalSize = Buffer.byteLength(original, 'utf8');
  const compressedSize = compressed.length;
  const ratio = (1 - (compressedSize / originalSize)) * 100;
  
  return {
    originalSize,
    compressedSize,
    reductionPercentage: ratio.toFixed(2) + '%'
  };
}
