export const resolveImage = (url) => {
  if (!url) return null;
  
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url;
  }

  const API_BASE_URL = 'http://localhost:8081';
  let normalizedPath = url.startsWith('/') ? url : `/${url}`;
  
  // My backend serves from /uploads/**
  if (!normalizedPath.startsWith('/uploads/')) {
    normalizedPath = `/uploads${normalizedPath}`;
  }
  
  return `${API_BASE_URL}${normalizedPath}`;
};
