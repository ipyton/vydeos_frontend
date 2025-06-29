/**
 * Image compression utility for client-side use only
 */
class ImageCompressorClass {
  /**
   * Compresses an image to a target size
   * 
   * @param {File} file - The image file to compress
   * @param {number} maxWidth - Maximum width of the compressed image
   * @param {number} quality - Quality of the compressed image (0-1)
   * @returns {Promise<File>} - A promise that resolves to the compressed image file
   */
  async compressImage(file, maxWidth = 1024, quality = 0.8) {
    // SSR check - return original file if on server
    if (typeof window === 'undefined') {
      return file;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          // Create canvas and context for drawing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert canvas to blob with compression
          canvas.toBlob((blob) => {
            if (blob) {
              // Create new file from blob
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          }, file.type, quality);
        };
        
        img.onerror = (error) => {
          reject(error);
        };
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  /**
   * Creates a thumbnail from an image
   * 
   * @param {File} file - The image file to create a thumbnail from
   * @param {number} thumbnailWidth - Width of the thumbnail
   * @returns {Promise<string>} - A promise that resolves to the thumbnail data URL
   */
  async createThumbnail(file, thumbnailWidth = 200) {
    // SSR check
    if (typeof window === 'undefined') {
      return '';
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          // Calculate dimensions
          let width = img.width;
          let height = img.height;
          
          if (width > thumbnailWidth) {
            height = (height * thumbnailWidth) / width;
            width = thumbnailWidth;
          }
          
          // Create canvas and context for drawing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get data URL
          const thumbnailUrl = canvas.toDataURL(file.type);
          resolve(thumbnailUrl);
        };
        
        img.onerror = (error) => {
          reject(error);
        };
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }
}

// Create singleton instance
const ImageCompressor = new ImageCompressorClass();

export default ImageCompressor; 