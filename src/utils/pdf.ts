import { Order } from '../types';
import { formatCurrency } from './currency';
import { formatDate } from './date';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generateReceiptPDF(
  order: Order,
  settings?: any
): Promise<jsPDF> {
  try {
    // Create a temporary div to render the receipt
    const receiptDiv = document.createElement('div');
    receiptDiv.style.position = 'absolute';
    receiptDiv.style.left = '-9999px';
    receiptDiv.style.padding = '20px';
    receiptDiv.style.background = 'white';
    receiptDiv.style.width = '595px'; // A4 width in pixels

    // Add receipt content
    receiptDiv.innerHTML = `

    ${
      settings.logo
        ? `<div style="display: flex; justify-content: center;"> 
            <img src="${settings.logo}" width="${settings.logoWidth}px" height="${settings.logoHeight}px" />     
          </div>`
        : ''
    }
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #000; padding: 20px;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px; color: #000">
          ${settings?.name || 'Restaurant'}
        </h1>
        <div style="text-align: center; margin-bottom: 20px;">
          <p style="color: #000">Commande #${order.id.slice(0, 8)}</p>
          <p style="color: #000">${formatDate(order.createdAt)}</p>
        </div>
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-bottom: 10px;">Détails Client</h2>
          <p style="color: #000">${order.customerName}</p>
          <p style="color: #000">${order.customerPhone}</p>
          ${order.customerAddress ? `<p>${order.customerAddress}</p>` : ''}
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f4f4f4;">
            <th style="text-align: left; padding: 8px;">Article</th>
            <th style="text-align: right; padding: 8px;">Qté</th>
            <th style="text-align: right; padding: 8px;">Prix</th>
            <th style="text-align: right; padding: 8px;">Total</th>
          </tr>
          ${order.items
            .map(
              item => `
            <tr>
              <td style="padding: 8px;">${item.name}</td>
              <td style="text-align: right; padding: 8px;">${item.quantity}</td>
              <td style="text-align: right; padding: 8px;">${formatCurrency(
                item.price,
                settings?.currency
              )}</td>
              <td style="text-align: right; padding: 8px;">${formatCurrency(
                item.price * item.quantity,
                settings?.currency
              )}</td>
            </tr>
          `
            )
            .join('')}
          <tr style="font-weight: bold; background-color: #f4f4f4;">
            <td colspan="3" style="text-align: right; padding: 8px;">Total</td>
            <td style="text-align: right; padding: 8px;">${formatCurrency(
              order.total,
              settings?.currency
            )}</td>
          </tr>
        </table>
        <div style="text-align: center; font-size: 14px;">
          <p style="color: #000">Merci de votre confiance !</p>
          ${
            settings?.address
              ? `<p style="color: #000">${settings.address}</p>`
              : ''
          }
          ${
            settings?.phone
              ? `<p style="color: #000">${settings.phone}</p>`
              : ''
          }
        </div>
      </div>
    `;

    document.body.appendChild(receiptDiv);

    // Convert to canvas
    const canvas = await html2canvas(receiptDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Remove temporary div
    document.body.removeChild(receiptDiv);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    // Add canvas to PDF
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    return pdf;
    // Download PDF
    // pdf.save(`commande-${order.id.slice(0, 8)}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF receipt');
  }
}
