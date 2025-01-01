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
      onclone: (clonedDoc) => {
        // Ensure text is sharp in the exported image
        const style = clonedDoc.createElement('style');
        style.innerHTML = `
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `;
        clonedDoc.head.appendChild(style);
      }
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