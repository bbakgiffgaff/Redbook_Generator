export interface CompressOptions {
  maxDimension: number; // px
  quality: number; // 0-1
}

export const isValidImageFile = (file: File, maxSize: number): string | null => {
  if (!file.type.startsWith('image/')) {
    return '仅支持图片文件';
  }
  if (file.size > maxSize) {
    return `图片大小超出限制（${Math.round(maxSize / (1024 * 1024))}MB）`;
  }
  return null;
};

export const compressImageFile = async (file: File, options: CompressOptions): Promise<string> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  const { maxDimension, quality } = options;
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const targetWidth = Math.max(1, Math.round(img.width * scale));
  const targetHeight = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法创建画布上下文');
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
  return compressedDataUrl;
};

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsDataURL(file);
  });
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = src;
  });
};
