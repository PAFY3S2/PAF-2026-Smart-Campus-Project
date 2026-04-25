const BASE_URL = 'http://localhost:8081';

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('blob:')) return path; // Handle browser previews
  
  // Normalize the path: remove leading slash if present for easier prepending
  let cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // If it doesn't already start with /uploads/, prepend it
  if (!cleanPath.startsWith('/uploads/')) {
    cleanPath = `/uploads${cleanPath}`;
  }
  
  return `${BASE_URL}${cleanPath}`;
};

export const resolveImage = getImageUrl;
