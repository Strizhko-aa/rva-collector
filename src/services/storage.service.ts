// Описываем контракт: любая функция загрузки должна принимать файл и возвращать URL
export interface IStorageService {
  uploadFile: (file: File, onProgress?: (p: number) => void) => Promise<string>;
  uploadMultiple: (files: File[], onProgress?: (percent: number) => void) => Promise<string[]>;
}

// Реализация для Cloudinary
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/demenujhg/image/upload';
const UPLOAD_PRESET = 'upload-rva-preset'; // Создается в настройках Cloudinary (Upload -> Upload presets)

export const storageService: IStorageService = {
  uploadFile: (file: File, onProgress?: (p: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      // Отслеживаем реальные байты загрузки
      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress(percentComplete);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.open('POST', CLOUDINARY_URL);
      xhr.send(formData);
    });
  },

  uploadMultiple: async (files: File[], onProgress?: (percent: number) => void): Promise<string[]> => {
    // Храним прогресс каждого файла отдельно
    const progressMap: number[] = new Array(files.length).fill(0);

    const promises = files.map((file, index) => 
      storageService.uploadFile(file, (percent) => {
        progressMap[index] = percent;
        // Считаем средний процент по всем файлам
        const totalProgress = progressMap.reduce((acc, curr) => acc + curr, 0) / files.length;
        if (onProgress) onProgress(totalProgress);
      })
    );

    return Promise.all(promises);
  }
};