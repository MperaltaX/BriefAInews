/**
 * Constants for Fallbacks
 */
export const FALLBACK_IMAGE = '/logo_brief_ai_news.png';

/**
 * Normalizes the image_url field which might come as a string or an object with images array.
 * @param {string|Object} imageUrl - The raw image data from the backend
 * @returns {string} Fully qualified image URL or fallback
 */
export const normalizeImage = (imageUrl) => {
    try {
        if (!imageUrl) return FALLBACK_IMAGE;

        // If it's directly a string and looks like a URL
        if (typeof imageUrl === 'string') {
            return imageUrl.trim();
        }

        // If it's a direct array of URL strings (e.g. ["https://...", "https://..."])
        if (Array.isArray(imageUrl) && imageUrl.length > 0) {
            const firstValid = imageUrl.find((url) => typeof url === 'string' && url.trim().length > 0);
            return firstValid?.trim() ?? FALLBACK_IMAGE;
        }

        // If it's an object with an array of images (e.g. { imagenes: ["https://..."] })
        if (typeof imageUrl === 'object' && Array.isArray(imageUrl.imagenes) && imageUrl.imagenes.length > 0) {
            return imageUrl.imagenes[0].trim();
        }

        // Additional edge case: if someone parses JSON String as an object without 'imagenes' key
        if (typeof imageUrl === 'object' && imageUrl.url) {
            return imageUrl.url.trim();
        }

        return FALLBACK_IMAGE;
    } catch (e) {
        console.error('Error normalizing image:', e);
        return FALLBACK_IMAGE;
    }
};

/**
 * Parses a given date and returns a human readable relative time span in Spanish.
 * Uses standard JS `Intl.RelativeTimeFormat`.
 * @param {string|Date} dateString - Valid date value string or Date object
 * @returns {string} String representing relative time like "Hace 2 horas"
 */
export const getRelativeTime = (dateString) => {
    if (!dateString) return 'Hace un momento';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha desconocida';

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

    if (diffInDays > 0) {
        return rtf.format(-diffInDays, 'day'); // "hace 2 días"
    }

    if (diffInHours > 0) {
        return rtf.format(-diffInHours, 'hour'); // "hace 2 horas"
    }

    if (diffInMinutes > 0) {
        return rtf.format(-diffInMinutes, 'minute'); // "hace 5 minutos"
    }

    return 'Hace un momento';
};
