/**
 * Image compression utility that maintains aspect ratio and ensures file size stays below limit
 * Uses browser-image-compression library for optimal results
 * 
 * Installation: npm install browser-image-compression
 */

import imageCompression from 'browser-image-compression';

class ImageCompressor {
  /**
   * Compress image to stay below specified file size
   * @param {File} file - The image file to compress
   * @param {number} maxSizeKB - Maximum file size in KB (e.g., 500 for 500KB)
   * @param {Object} options - Optional compression settings
   * @returns {Promise<File>} - Compressed image file
   */
  static async compressImage(file, maxSizeKB, options = {}) {
    try {
      // Validate input
      if (!file || !file.type.startsWith('image/')) {
        throw new Error('Please provide a valid image file');
      }

      if (maxSizeKB <= 0) {
        throw new Error('Maximum size must be greater than 0');
      }

      // Default compression options
      const defaultOptions = {
        maxSizeMB: maxSizeKB / 1024, // Convert KB to MB
        maxWidthOrHeight: 1920, // Start with reasonable max dimension
        useWebWorker: true,
        fileType: file.type,
        initialQuality: 0.8 // Start with 80% quality
      };

      // Merge with user options
      const compressionOptions = { ...defaultOptions, ...options };

      // If file is already small enough, return it
      if (file.size <= maxSizeKB * 1024) {
        console.log('File is already within size limit');
        return file;
      }

      console.log(`Original file size: ${(file.size / 1024).toFixed(2)} KB`);
      console.log(`Target size: ${maxSizeKB} KB`);

      // First compression attempt
      let compressedFile = await imageCompression(file, compressionOptions);

      // If still too large, iteratively reduce quality and dimensions
      let attempts = 0;
      const maxAttempts = 5;
      
      while (compressedFile.size > maxSizeKB * 1024 && attempts < maxAttempts) {
        attempts++;
        
        // Reduce quality more aggressively
        compressionOptions.initialQuality = Math.max(0.1, compressionOptions.initialQuality * 0.7);
        
        // Reduce max dimensions if quality is already very low
        if (compressionOptions.initialQuality <= 0.3) {
          compressionOptions.maxWidthOrHeight = Math.max(480, compressionOptions.maxWidthOrHeight * 0.8);
        }

        console.log(`Attempt ${attempts}: Quality: ${compressionOptions.initialQuality.toFixed(2)}, Max dimension: ${compressionOptions.maxWidthOrHeight}`);
        
        compressedFile = await imageCompression(file, compressionOptions);
        
        console.log(`Compressed size: ${(compressedFile.size / 1024).toFixed(2)} KB`);
      }

      if (compressedFile.size > maxSizeKB * 1024) {
        console.warn(`Warning: Could not compress below ${maxSizeKB}KB. Final size: ${(compressedFile.size / 1024).toFixed(2)}KB`);
      } else {
        console.log(`✅ Successfully compressed to ${(compressedFile.size / 1024).toFixed(2)} KB`);
      }

      return compressedFile;

    } catch (error) {
      console.error('Image compression failed:', error);
      throw error;
    }
  }

  /**
   * Canvas-based compression alternative (no external library required)
   * @param {File} file - The image file to compress
   * @param {number} maxSizeKB - Maximum file size in KB
   * @param {number} initialQuality - Initial quality (0.1 to 1.0)
   * @returns {Promise<File>} - Compressed image file
   */
  static async compressImageCanvas(file, maxSizeKB, initialQuality = 0.8) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Please provide a valid image file'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate dimensions maintaining aspect ratio
        let { width, height } = img;
        const maxDimension = 1920;

        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        const compress = (quality) => {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            console.log(`Canvas compression - Quality: ${quality}, Size: ${(blob.size / 1024).toFixed(2)} KB`);

            if (blob.size <= maxSizeKB * 1024 || quality <= 0.1) {
              // Convert blob to file
              const compressedFile = new File([blob], file.name, {
                type: blob.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              // Try with lower quality
              compress(Math.max(0.1, quality * 0.8));
            }
          }, file.type, quality);
        };

        compress(initialQuality);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Helper method to get image dimensions
   * @param {File} file - Image file
   * @returns {Promise<{width: number, height: number}>}
   */
  static getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}




export default ImageCompressor;