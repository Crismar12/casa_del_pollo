import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Order } from '../../orders/types/order.types';

export function exportOrderToPdf(order: Order): void {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('El Pollo Dorado', 14, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Recibo de Pedido', 14, 30);

  doc.setDrawColor(200, 200, 200);
  doc.line(14, 34, 196, 34);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Pedido #:', 14, 44);
  doc.setFont('helvetica', 'normal');
  doc.text(order.id, 40, 44);

  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', 14, 52);
  doc.setFont('helvetica', 'normal');
  doc.text(order.client, 40, 52);

  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', 14, 60);
  doc.setFont('helvetica', 'normal');
  const date = new Date(order.createdAt);
  doc.text(date.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' }), 40, 60);

  doc.setFont('helvetica', 'bold');
  doc.text('Estado:', 14, 68);
  doc.setFont('helvetica', 'normal');
  doc.text(order.status, 40, 68);

  doc.line(14, 74, 196, 74);

  const tableData = order.products.map(p => [
    p.name,
    p.quantity.toString(),
    `S/ ${p.price.toFixed(2)}`,
    `S/ ${(p.price * p.quantity).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Producto', 'Cant.', 'Precio', 'Subtotal']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  doc.setDrawColor(200, 200, 200);
  doc.line(14, finalY, 196, finalY);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', 120, finalY + 10);
  doc.text(`S/ ${order.total.toFixed(2)}`, 155, finalY + 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('Gracias por su compra!', 105, finalY + 22, { align: 'center' });

  doc.save(`pedido-${order.id}.pdf`);
}
