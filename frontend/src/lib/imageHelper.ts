export const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?w=800&auto=format&fit=crop&q=80';
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Convert relative backend path to absolute URL
  const api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const backendBase = api_url.endsWith('/api') ? api_url.slice(0, -4) : api_url;
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${backendBase}${cleanPath}`;
};
