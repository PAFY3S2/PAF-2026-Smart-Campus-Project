const blobCache = new Map();
const SESSION_CACHE_BUSTER = new Date().getTime();

export const resolveImage = (url) => {
  console.log('[DEBUG] resolveImage called with:', url ? url.substring(0, 50) + '...' : url);
  if (!url) {
    return null;
  }
  
  // If it's already a base64 string, keep it as is
  if (url.startsWith('data:')) {
    // If it's a huge base64 string, convert it to a blob URL to prevent browser lag
    if (url.length > 500000) {
      if (blobCache.has(url)) {
        return blobCache.get(url);
      }
      try {
        const parts = url.split(',');
        const mime = parts[0].match(/:(.*?);/)[1];
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        blobCache.set(url, blobUrl);
        return blobUrl;
      } catch (e) {
        console.warn('Failed to create blob from base64, returning raw string', e);
        return url;
      }
    }
    return url;
  }

  // If it's already an absolute URL (e.g. external hosting), return as is
  if (url.startsWith('http')) {
    console.log('[DEBUG] Returning full URL:', url);
    return url;
  }

  // Construct absolute URL targeting the API backend
  const API_BASE_URL = 'http://localhost:8081';
  let filename = url.startsWith('/') ? url.substring(1) : url;
  
  if (filename.startsWith('uploads/')) {
    filename = filename.substring(8);
  } else if (filename.startsWith('api/resources/uploads/')) {
    filename = filename.substring(22);
  }
  
  const finalUrl = `${API_BASE_URL}/api/resources/uploads/${filename}?cb=${SESSION_CACHE_BUSTER}`;
  console.log('[DEBUG] Returning resolved API URL:', finalUrl);
  return finalUrl;
};
