import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  where,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { StockUpdateError } from './errors';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils';
import jsPDF from 'jspdf';

interface StockUpdate {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  reason: string;
  cost: number;
  date: string;
  type: string;
  orderId?: string;
}

interface GetHistoryOptions {
  startDate?: Date;
  endDate?: Date;
  itemId?: string;
  page?: number;
  pageSize?: number;
  lastDoc?: any;
}

interface HistoryResponse {
  updates: StockUpdate[];
  totalCount: number;
  lastDoc?: any;
}

class StockHistoryService {
  private readonly collection = 'stock_history';

  async getHistory(options: GetHistoryOptions = {}): Promise<HistoryResponse> {
    try {
      const {
        startDate,
        endDate,
        itemId,
        page = 1,
        pageSize = 10,
        lastDoc,
      } = options;

      // Build query constraints
      const constraints: any[] = [orderBy('date', 'desc')];

      if (startDate) {
        constraints.push(where('date', '>=', startDate.toISOString()));
      }

      if (endDate) {
        constraints.push(where('date', '<=', endDate.toISOString()));
      }

      if (itemId) {
        constraints.push(where('itemId', '==', itemId));
      }

      // Get total count first
      const countQuery = query(collection(db, this.collection), ...constraints);
      const countSnapshot = await getDocs(countQuery);
      const totalCount = countSnapshot.size;

      // Add pagination constraints
      constraints.push(limit(pageSize));
      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      // Get paginated data
      const q = query(collection(db, this.collection), ...constraints);
      const snapshot = await getDocs(q);

      const updates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as StockUpdate[];

      return {
        updates,
        totalCount,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
      };
    } catch (error) {
      console.error('Error fetching stock history:', error);
      throw new StockUpdateError(
        'Failed to fetch stock history',
        'history/fetch-error',
        error
      );
    }
  }

  async addUpdate(update: Omit<StockUpdate, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...update,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding stock update:', error);
      throw new StockUpdateError(
        'Failed to add stock update',
        'history/add-error',
        error
      );
    }
  }

  async generateHistoryPDF(startDate?: Date, endDate?: Date): Promise<void> {
    try {
      // Fetch all history for the date range
      const { updates } = await this.getHistory({
        startDate,
        endDate,
        pageSize: 1000, // Get more records for the report
      });

      // Create PDF document
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPos = 20;

      // Add title
      pdf.setFontSize(16);
      pdf.text('Historique des Stocks', pageWidth / 2, yPos, {
        align: 'center',
      });
      yPos += 10;

      // Add date range
      pdf.setFontSize(12);
      const dateRange = `${
        startDate ? formatDate(startDate.toISOString()) : 'Début'
      } - ${endDate ? formatDate(endDate.toISOString()) : "Aujourd'hui"}`;
      pdf.text(`Période: ${dateRange}`, pageWidth / 2, yPos, {
        align: 'center',
      });
      yPos += 20;

      // Add table headers
      const headers = ['Date', 'Produit', 'Quantité', 'Raison', 'Coût'];
      const colWidths = [30, 50, 25, 50, 35];
      let xPos = 10;

      pdf.setFillColor(240, 240, 240);
      pdf.rect(xPos, yPos - 5, pageWidth - 20, 10, 'F');
      pdf.setFontSize(10);

      headers.forEach((header, i) => {
        pdf.text(header, xPos, yPos);
        xPos += colWidths[i];
      });
      yPos += 10;

      // Add table rows
      pdf.setFontSize(9);
      updates.forEach(update => {
        // Check if we need a new page
        if (yPos > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage();
          yPos = 20;
        }

        xPos = 10;
        pdf.text(formatDate(update.date), xPos, yPos);
        xPos += colWidths[0];

        pdf.text(update.itemName, xPos, yPos);
        xPos += colWidths[1];

        pdf.text(update.quantity.toString(), xPos, yPos);
        xPos += colWidths[2];

        pdf.text(update.reason, xPos, yPos);
        xPos += colWidths[3];

        pdf.text(formatCurrency(update.cost), xPos, yPos);

        yPos += 7;
      });

      // Add summary
      yPos += 10;
      const totalCost = updates.reduce((sum, update) => sum + update.cost, 0);
      const totalQuantity = updates.reduce(
        (sum, update) => sum + update.quantity,
        0
      );

      pdf.setFontSize(11);
      pdf.text(`Total des mouvements: ${totalQuantity}`, 10, yPos);
      pdf.text(
        `Coût total: ${formatCurrency(totalCost)}`,
        pageWidth - 60,
        yPos
      );

      // Save the PDF
      const fileName = `historique-stocks-${
        new Date().toISOString().split('T')[0]
      }.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new StockUpdateError(
        'Failed to generate PDF',
        'history/pdf-error',
        error
      );
    }
  }
}

export const stockHistoryService = new StockHistoryService();
