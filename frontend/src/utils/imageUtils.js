const BASE_URL = 'http://localhost:8081';

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('blob:')) return path; // Handle browser previews
  
  // Prepend backend URL if it's a relative path starting with /uploads
  if (path.startsWith('/uploads')) {
    return `${BASE_URL}${path}`;
  }
  
  return path;
};

export const resolveImage = getImageUrl;
