// Описываем контракт: любая функция загрузки должна принимать файл и возвращать URL
export interface IStorageService {
  uploadFile: (file: File) => Promise<string>;
  uploadMultiple: (files: File[]) => Promise<string[]>;
}

// Реализация для Cloudinary
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/demenujhg/image/upload';
const UPLOAD_PRESET = 'upload-rva-preset'; // Создается в настройках Cloudinary (Upload -> Upload presets)

export const storageService: IStorageService = {
  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.secure_url;
  },

  uploadMultiple: async (files: File[]): Promise<string[]> => {
    return Promise.all(files.map(file => storageService.uploadFile(file)));
  }
};