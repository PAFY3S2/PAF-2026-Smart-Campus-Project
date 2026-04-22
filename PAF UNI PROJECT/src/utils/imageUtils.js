export const resolveImage = (url) => {
  if (!url) return null;
  
  // Safe console log for debugging
  console.log("Image URL:", url);

  // If it's already a full HTTP/HTTPS URL or Data URI, return as-is
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url;
  }

  // The backend base URL (should match where the Spring Boot server runs)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  // Ensure the path always points to the Spring Boot static /uploads/ handler!
  let normalizedPath = url.startsWith('/') ? url : `/${url}`;
  if (!normalizedPath.startsWith('/uploads/')) {
    normalizedPath = `/uploads${normalizedPath}`;
  }
  
  return `${API_BASE_URL}${normalizedPath}`;
};
