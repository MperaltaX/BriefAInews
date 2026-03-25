import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Exports a DOM element to PDF with high resolution.
 * @param {HTMLElement} element - The DOM element to capture.
 * @param {string} [filename='portada-del-dia.pdf'] - The name for the downloaded file.
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export const exportPortadaToPdf = async (element, filename = 'portada-del-dia.pdf') => {
    if (!element) return { success: false, error: 'Element not found' };

    try {
        // 1. Capture the element as a high-res PNG
        // We use a high pixelRatio to ensure text and images are sharp
        const dataUrl = await toPng(element, {
            quality: 1,
            pixelRatio: 3, // High DPI for print quality
            backgroundColor: '#ffffff',
            style: {
                transform: 'scale(1)', // Ensure it's captured at base size
                transformOrigin: 'top left',
            }
        });

        // 2. Create PDF (A4 size is approximately 595x842 points)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [595, 842]
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // 3. Add the image to the PDF
        // We stretch it to fill the page (since our Portada component is designed for 595x842)
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

        // 4. Download the file
        pdf.save(filename);

        return { success: true };
    } catch (error) {
        console.error('Error generating PDF:', error);
        return { success: false, error };
    }
};
