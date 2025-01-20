import jsPDF from 'jspdf';

export async function exportToPng(element: HTMLElement): Promise<void> {
  const { default: html2canvas } = await import('html2canvas');

  try {
    // Apply white background and proper scaling
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true, // Enable cross-origin image loading
      windowWidth: 1920, // Force desktop width for consistent rendering
      onclone: clonedDoc => {
        // Ensure text is sharp in the exported image
        const style = clonedDoc.createElement('style');
        style.innerHTML = `
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `;
        clonedDoc.head.appendChild(style);
      },
    });

    // Create download link with formatted filename
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.download = `etats-financiers-${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    throw error;
  }
}

export async function exportToPdf(element: HTMLElement): Promise<void> {
  const { default: html2canvas } = await import('html2canvas');

  try {
    // Apply white background and proper scaling
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true, // Enable cross-origin image loading
      windowWidth: 1920, // Force desktop width for consistent rendering
      onclone: clonedDoc => {
        // Ensure text is sharp in the exported image
        const style = clonedDoc.createElement('style');
        style.innerHTML = `
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `;
        clonedDoc.head.appendChild(style);
      },
    });

    // Get canvas dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Initialize PDF
    const pdf = new jsPDF({
      orientation: imgHeight > pageHeight ? 'portrait' : 'landscape',
      unit: 'mm',
    });

    // Calculate if we need multiple pages
    let heightLeft = imgHeight;
    let position = 0;
    let pageNumber = 1;

    // Add image to first page
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight,
      '',
      'FAST'
    );
    heightLeft -= pageHeight;

    // Add new pages if content overflows
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
        '',
        'FAST'
      );
      heightLeft -= pageHeight;
      pageNumber++;
    }

    // Create download with formatted filename
    const date = new Date().toISOString().split('T')[0];
    pdf.save(`etats-financiers-${date}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
}
