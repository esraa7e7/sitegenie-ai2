/**
 * Compresses a string or object into a Gzipped Buffer.
 */
export declare function compress(data: string | object): Buffer;
/**
 * Decompresses a Gzipped Buffer back into its original form.
 */
export declare function decompress(buffer: Buffer | Uint8Array): string;
/**
 * Calculates approximately how much space is saved.
 */
export declare function getCompressionStats(original: string, compressed: Buffer): {
    originalSize: number;
    compressedSize: number;
    reductionPercentage: string;
};
//# sourceMappingURL=compression.d.ts.map