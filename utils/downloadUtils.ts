import html2canvas from 'html2canvas';
import JSZip from 'jszip';

export const generateAndDownloadZip = async (containerId: string, filename: string = 'redbook-cards') => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found');
    return;
  }

  const cards = container.children;
  const zip = new JSZip();
  const folder = zip.folder(filename);

  // Helper to wait for font loading
  await document.fonts.ready;

  const promises = Array.from(cards).map(async (cardWrapper, index) => {
    // Select the actual card node to ignore wrapper margins/transform
    const element = (cardWrapper as HTMLElement).querySelector('.card-node') as HTMLElement;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Retina quality
        useCORS: true,
        backgroundColor: null, // Transparent base, though card has background
        logging: false,
      });

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png');
      });

      if (blob && folder) {
        // Pad numbers for sorting: card_01.png
        const fileNum = (index + 1).toString().padStart(2, '0');
        folder.file(`card_${fileNum}.png`, blob);
      }
    } catch (err) {
      console.error(`Error generating card ${index + 1}`, err);
    }
  });

  await Promise.all(promises);

  const content = await zip.generateAsync({ type: 'blob' });

  // Trigger download
  const url = window.URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.zip`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};