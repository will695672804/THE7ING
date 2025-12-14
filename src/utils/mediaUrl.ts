// Helper to construct the full media URL from a potentially relative path or localhost URL
const BACKEND_URL = 'https://site--the7e1--vm5pf569dg4m.code.run';

export function getMediaUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
        return '/placeholder-image.png'; // Fallback placeholder
    }

    // If it's already a full URL to the production server, return as-is
    if (imagePath.startsWith(BACKEND_URL)) {
        return imagePath;
    }

    // If it's a localhost URL, extract the path and use production backend
    if (imagePath.includes('localhost') || imagePath.includes('127.0.0.1')) {
        // Extract the path after the port (e.g., /media/products/image.jpg)
        const match = imagePath.match(/:\d+(.+)/);
        if (match) {
            return `${BACKEND_URL}${match[1]}`;
        }
    }

    // If it's a relative path starting with /media, prefix with backend URL
    if (imagePath.startsWith('/media')) {
        return `${BACKEND_URL}${imagePath}`;
    }

    // If it starts with media (without leading slash)
    if (imagePath.startsWith('media/')) {
        return `${BACKEND_URL}/${imagePath}`;
    }

    // Otherwise, assume it's a relative path and construct full URL
    return `${BACKEND_URL}/media/${imagePath}`;
}
