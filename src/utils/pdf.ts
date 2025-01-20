import { Order, RestaurantSettings } from '../types';
import { formatCurrency } from './currency';
import { formatDate } from './date';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { formatTaxRate } from './tax';

export async function generateReceiptPDF(
  order: Order,
  settings?: any
): Promise<jsPDF> {
  try {
    const receiptDiv = document.createElement('div');
    receiptDiv.style.position = 'absolute';
    receiptDiv.style.left = '-9999px';
    receiptDiv.style.background = 'white';
    receiptDiv.style.width = '280px';
    receiptDiv.style.padding = '15px';
    receiptDiv.style.fontFamily = 'Courier, monospace';
    receiptDiv.style.fontSize = '11px';
    receiptDiv.style.lineHeight = '1.3';
    receiptDiv.style.color = 'rgb(0, 0, 0)';
    receiptDiv.style.webkitPrintColorAdjust = 'exact';
    receiptDiv.style.printColorAdjust = 'exact';

    const qrCodeUrl = await QRCode.toDataURL(
      `${window.location.origin}/order/${order.id}`,
      {
        margin: 0,
        width: 120,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }
    );

    const baseStyles =
      'color: rgb(0, 0, 0) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;';

    // Helper function to capitalize first letter
    const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

    receiptDiv.innerHTML = `
      <div style="${baseStyles} background-color: white;">
        <div style="text-align: center; ${baseStyles}">
          ${
            settings?.logo
              ? `
            <div style="margin-bottom: 15px; display: flex; justify-content: center;">
              <img src="${settings.logo}" width="${
                  settings.logoWidth || 120
                }px" style="max-width: 80px;" />
            </div>
          `
              : ''
          }
          ${
            settings?.name
              ? `
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 4px; ${baseStyles}">
              ${settings?.name || "L'Assiette"}
          </div>
            `
              : ''
          }

          ${
            settings?.address
              ? `
              <div style="margin-bottom: 2px; ${baseStyles}">
                ${settings?.address || '3000, rue de Mary'}
              </div>
            `
              : ''
          }
        
        

        </div>

        <div style="border-bottom: 1px dashed rgb(0, 0, 0); margin: 8px 0;"></div>

        <div style="margin-bottom: 8px; ${baseStyles}">
          <div style="${baseStyles}">${formatDate(order.createdAt)}</div>
          <div style="${baseStyles}">TRANSACTION #${order.id.slice(0, 6)}</div>
          <div style="${baseStyles}">${
      order.diningOption === 'delivery' ? 'Livraison' : 'Sur place'
    }</div>
          ${
            order.tableNumber
              ? `<div style="${baseStyles}">Table #${order.tableNumber}</div>`
              : ''
          }
        </div>

        <div style="margin-bottom: 8px; ${baseStyles}">
          <div style="${baseStyles}">${order.customerName}</div>
          ${
            order.customerPhone
              ? `<div style="${baseStyles}">${order.customerPhone}</div>`
              : ''
          }
          ${
            order.customerEmail
              ? `<div style="${baseStyles}">${order.customerEmail}</div>`
              : ''
          }
          ${
            order.customerAddress
              ? `<div style="${baseStyles}">${order.customerAddress}</div>`
              : ''
          }
          ${
            order.preference
              ? `<div style="font-size: 10px; ${baseStyles}">Note: ${order.preference}</div>`
              : ''
          }
        </div>

        <div style="margin-bottom: 8px; ${baseStyles}">
          ${order.items
            .map(
              item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px; ${baseStyles}">
              <div style="${baseStyles}">${item.quantity} ${item.name}</div>
              <div style="${baseStyles}">${formatCurrency(
                item.price * item.quantity,
                settings?.currency
              )}</div>
            </div>
          `
            )
            .join('')}
        </div>

        <div style="border-bottom: 1px dashed rgb(0, 0, 0); margin: 8px 0;"></div>

       ${
         order.subtotal > 0
           ? `
        
        <div style="margin-bottom: 8px; ${baseStyles}">
          <div style="display: flex; justify-content: space-between; ${baseStyles}">
            <div style="${baseStyles}">SOUS-TOTAL</div>
            <div style="${baseStyles}">${formatCurrency(
               order.subtotal,
               settings?.currency
             )}</div>
          </div>
        `
           : ''
       } 

          ${
            order.taxes?.length > 0
              ? order.taxes
                  ?.map(
                    tax => `
            <div style="display: flex; justify-content: space-between; ${baseStyles}">
              <div style="${baseStyles}">${tax.name} (${Number(
                      tax.rate
                    ).toFixed(3)}%)</div>
              <div style="${baseStyles}">${formatCurrency(
                      tax.amount,
                      settings?.currency
                    )}</div>
            </div>
          `
                  )
                  .join('')
              : ''
          }

          ${
            order.tip
              ? `
            <div style="display: flex; justify-content: space-between; ${baseStyles}">
              <div style="${baseStyles}">Pourboire${
                  order.tip.percentage ? ` (${order.tip.percentage}%)` : ''
                }</div>
              <div style="${baseStyles}">${formatCurrency(
                  order.tip.amount,
                  settings?.currency
                )}</div>
            </div>
          `
              : ''
          }

          <div style="display: flex; justify-content: space-between; margin-top: 4px; ${baseStyles}">
            <div style="${baseStyles}">TOTAL</div>
            <div style="${baseStyles}">${formatCurrency(
      order.total,
      settings?.currency
    )}</div>
          </div>
          ${
            order.amountPaid && order.amountPaid > 0
              ? `
            
              <div style="display: flex; justify-content: space-between; margin-top: 4px; ${baseStyles}">
            <div style="${baseStyles}">MONTANT REÇU</div>
            <div style="${baseStyles}">${formatCurrency(
                  order.amountPaid,
                  settings?.currency
                )}</div>
          </div>
            `
              : ''
          }
        
          ${
            order.change && order.change > 0
              ? `   <div style="display: flex; justify-content: space-between; margin-top: 4px; ${baseStyles}">
            <div style="${baseStyles}">MONNAIE RENDUE</div>
            <div style="${baseStyles}">${formatCurrency(
                  order.change,
                  settings?.currency
                )}</div>
          </div>`
              : ''
          }
        </div>

        <div style="margin-bottom: 8px; ${baseStyles}">
          <div style="${baseStyles}">${
      order.paymentMethod?.name || 'PAIEMENT SUR PLACE'
    }</div>
  
        </div>

        <div style="text-align: center; margin: 12px 0; ${baseStyles}">
          <div style="margin-bottom: 8px; ${baseStyles}">PAIEMENT REÇU</div>
          <img src="${qrCodeUrl}" width="120" style="margin: 0 auto; display: block;" />
              ${
                order.servedBy
                  ? `<div style="${baseStyles}">Vous avez été servi par ${order.servedBy}</div>`
                  : ''
              }
        </div>

        <div style="text-align: center; margin: 12px 0; ${baseStyles}">
          <div style="${baseStyles}">${formatDate(order.createdAt, true)}</div>
        </div>
        <div style="border-bottom: 1px dashed rgb(0, 0, 0); margin: 8px 0;"></div>
      </div>
    `;

    document.body.appendChild(receiptDiv);

    const canvas = await html2canvas(receiptDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      onclone: document => {
        const elements = document.getElementsByTagName('*');
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i] as HTMLElement;
          if (element.style) {
            element.style.color = 'rgb(0, 0, 0)';
          }
        }
      },
    });

    document.body.removeChild(receiptDiv);

    const contentWidth = 280;
    const contentHeight = canvas.height * (contentWidth / canvas.width);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [contentWidth, contentHeight],
      putOnlyUsedFonts: true,
      compress: true,
    });

    pdf.addImage(
      canvas.toDataURL('image/png', 1.0),
      'PNG',
      0,
      0,
      contentWidth,
      contentHeight,
      undefined,
      'FAST'
    );

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF receipt');
  }
}

export async function generateUserReceipt(
  order: Order,
  settings?: RestaurantSettings | null
): Promise<jsPDF> {
  try {
    // Create a temporary div to render the receipt
    const receiptDiv = document.createElement('div');
    receiptDiv.style.position = 'absolute';
    receiptDiv.style.left = '-9999px';
    receiptDiv.style.padding = '20px';
    receiptDiv.style.background = 'white';
    receiptDiv.style.width = '595px'; // A4 width in pixels

    // Add receipt content with modified table styling
    receiptDiv.innerHTML = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #000000; max-width: 515px; margin: 0 auto;">
        ${
          settings?.logo
            ? `<div style="display: flex; justify-content: center; margin-bottom: 15px;"> 
                <img src="${settings.logo}" width="${settings.logoWidth}px" height="${settings.logoHeight}px" style="max-width: 150px;" />     
              </div>`
            : ''
        }
        
        <h1 style="text-align: center; font-size: 20px; margin: 0 0 15px 0; color: #000000; font-weight: 600;">
          ${settings?.name || 'Restaurant'}
        </h1>

        <div style="text-align: center; margin-bottom: 15px;">
          <p style="color: #000000; font-size: 14px; margin: 0 0 4px 0;">Récapitulatif de Commande #${order.id.slice(
            0,
            8
          )}</p>
          <p style="color: #000000; font-size: 13px; margin: 0;">${formatDate(
            order.createdAt,
            true
          )}</p>
        </div>

        <div style="margin-bottom: 15px; background: #f8f8f8; padding: 12px; border-radius: 6px;">
          <h2 style="font-size: 15px; margin: 0 0 8px 0; color: #000000;">Détails Client</h2>
          <p style="color: #000000; margin: 0 0 4px 0; font-size: 13px;">${
            order.customerName
          }</p>
          <p style="color: #000000; margin: 0 0 4px 0; font-size: 13px;">${
            order.customerPhone
          }</p>
          ${
            order.customerAddress
              ? `<p style="color: #000000; margin: 0; font-size: 13px;">${order.customerAddress}</p>`
              : ''
          }
        </div>

        <div style="margin-bottom: 15px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f4f4f4; color: #000000;">
              <th style="text-align: left; padding: 8px; font-size: 13px; font-weight: 600;">Article</th>
              <th style="text-align: right; padding: 8px; font-size: 13px; font-weight: 600;">Qté</th>
              <th style="text-align: right; padding: 8px; font-size: 13px; font-weight: 600;">Prix</th>
              <th style="text-align: right; padding: 8px; font-size: 13px; font-weight: 600;">Total</th>
            </tr>
            ${order.items
              .map(
                (item, index) => `
              <tr style="background-color: ${
                index % 2 === 0 ? '#ffffff' : '#fafafa'
              };">
                <td style="padding: 8px; font-size: 13px; color: #000000;">${
                  item.name
                }</td>
                <td style="text-align: right; padding: 8px; font-size: 13px; color: #000000;">${
                  item.quantity
                }</td>
                <td style="text-align: right; padding: 8px; font-size: 13px; color: #000000;">${formatCurrency(
                  item.price,
                  settings?.currency
                )}</td>
                <td style="text-align: right; padding: 8px; font-size: 13px; color: #000000;">${formatCurrency(
                  item.price * item.quantity,
                  settings?.currency
                )}</td>
              </tr>
            `
              )
              .join('')}
          </table>
        </div>
        <hr/> 
        <div style="margin-top: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #000000; font-size: 13px;">Sous-total</span>
            <span style="color: #000000; font-size: 13px;">${formatCurrency(
              order.subtotal,
              settings?.currency
            )}</span>
          </div>

          ${order?.taxes
            .map(
              tax => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #000000; font-size: 13px;">${
                tax.name
              } (${formatTaxRate(tax.rate)})</span>
              <span style="color: #000000; font-size: 13px;">${formatCurrency(
                tax.amount,
                settings?.currency
              )}</span>
            </div>
          `
            )
            .join('')}
          ${
            order.tip
              ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #000000; font-size: 13px;">${
                settings?.tips.label
              }</span>
              <span style="color: #000000; font-size: 13px;">${formatCurrency(
                order.tip.amount,
                settings?.currency
              )}</span>
            </div>
          `
              : ''
          }

          <div style="display: flex; justify-content: space-between; margin-top: 20px; border-top: 1px solid #eee;">
            <span style="color: #000000; font-size: 14px; font-weight: 600;">Total</span>
            <span style="color: #000000; font-size: 14px; font-weight: 600;">${formatCurrency(
              order.total,
              settings?.currency
            )}</span>
          </div>
        </div>

        <div style="text-align: center; padding-top: 12px; margin-top: 15px; border-top: 1px solid #eee;">
          <p style="color: #000000; font-size: 13px; margin: 0 0 8px 0;">Nous accusons réception de votre commande, vous recevrez le reçu de cette commande à la livraison !</p>
          ${
            settings?.address
              ? `<p style="color: #000000; font-size: 12px; margin: 0 0 4px 0;">${settings.address}</p>`
              : ''
          }
          ${
            settings?.phone
              ? `<p style="color: #000000; font-size: 12px; margin: 0;">${settings.phone}</p>`
              : ''
          }
        </div>
      </div>
    `;

    document.body.appendChild(receiptDiv);

    const canvas = await html2canvas(receiptDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
    });

    document.body.removeChild(receiptDiv);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const maxHeight = pdf.internal.pageSize.getHeight();
    let pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    if (pdfHeight > maxHeight) {
      pdfHeight = maxHeight;
    }

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF receipt');
  }
}
