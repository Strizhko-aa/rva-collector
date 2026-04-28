// src/utils/cloudinary.ts

export const getThumbnail = (url: string, width = 600, height = 450) => {
  if (!url || !url.includes('cloudinary')) return url;
  const transformation = `c_fill,w_${width},h_${height},g_auto,f_auto,q_auto`;
  return url.replace('/upload/', `/upload/${transformation}/`);
};

// Специальный метод для аватарок
export const getAvatar = (url: string | null | undefined, size = 100) => {
  if (!url) return undefined;
  if (!url.includes('cloudinary')) return url;
  
  // c_thumb + g_face — идеально для профилей
  // dpr_2.0 — чтобы на Retina-экранах аватарка не была мыльной
  const transformation = `c_thumb,w_${size},h_${size},g_face,f_auto,q_auto,dpr_2.0`;
  return url.replace('/upload/', `/upload/${transformation}/`);
};