const blobCache = new Map();

export const resolveImage = (url) => {
  console.log('[DEBUG] resolveImage called with:', url ? url.substring(0, 50) + '...' : url);
  if (!url) {
    console.log('[DEBUG] URL is empty or undefined. Returning null fallback.');
    return null;
  }
  
  if (url.startsWith('data:')) {
    console.log('[DEBUG] Processing Base64 string...');
    if (url.length > 500000) {
      if (blobCache.has(url)) {
        return blobCache.get(url);
      }
      try {
        const arr = url.split(',');
        if (arr.length === 2) {
          const mimeMatch = arr[0].match(/:(.*?);/);
          if (mimeMatch) {
            const mime = mimeMatch[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], { type: mime });
            const blobUrl = URL.createObjectURL(blob);
            blobCache.set(url, blobUrl);
            console.log('[DEBUG] Converted large Base64 to Blob URL:', blobUrl);
            return blobUrl;
          }
        }
      } catch (e) {
        console.warn('[DEBUG] Base64 to Blob conversion failed', e);
      }
    }
    return url;
  }

  if (url.startsWith('http')) {
    console.log('[DEBUG] Returning full URL:', url);
    return url;
  }

  const API_BASE_URL = 'http://localhost:8081';
  let normalizedPath = url.startsWith('/') ? url : `/${url}`;
  
  // My backend serves from /uploads/**
  if (!normalizedPath.startsWith('/uploads/')) {
    normalizedPath = `/uploads${normalizedPath}`;
  }
  
  const finalUrl = `${API_BASE_URL}${normalizedPath}`;
  console.log('[DEBUG] Returning resolved relative URL:', finalUrl);
  return finalUrl;
};
