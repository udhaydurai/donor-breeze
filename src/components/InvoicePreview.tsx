import React, { useRef } from 'react';
import { InvoiceData } from '@/types';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useInvoice } from '@/context/InvoiceContext';
import { Printer, Download, ChevronLeft } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const { organizationSettings } = useInvoice();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MM/dd/yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    invoiceRef.current.classList.add('pdf-export');
    
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      invoiceRef.current.classList.remove('pdf-export');
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      const margin = 15;
      const contentWidth = pdfWidth - (margin * 2);
      
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let finalImgWidth = imgWidth;
      let finalImgHeight = imgHeight;
      
      const maxContentHeight = pdfHeight - (margin * 2);
      
      if (imgHeight > maxContentHeight) {
        const scale = maxContentHeight / imgHeight;
        finalImgWidth = imgWidth * scale;
        finalImgHeight = maxContentHeight;
      }
      
      const xPosition = margin + (contentWidth - finalImgWidth) / 2;
      
      pdf.addImage(imgData, 'PNG', xPosition, margin, finalImgWidth, finalImgHeight);
      
      pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-1">
          <ChevronLeft size={16} /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-1 no-print">
            <Printer size={16} /> Print
          </Button>
          <Button variant="outline" onClick={downloadPDF} className="gap-1 no-print">
            <Download size={16} /> Download PDF
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto border p-8 shadow-sm print:shadow-none print:border-0">
        <div ref={invoiceRef} className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex items-center gap-3">
              {organizationSettings.logo ? (
                <img 
                  src={organizationSettings.logo} 
                  alt="Organization Logo" 
                  className="h-16 w-16 object-contain" 
                />
              ) : (
                <img 
                  src="/lovable-uploads/4c058ff9-0116-4e6d-8c40-7bffedea0727.png" 
                  alt="Organization Logo" 
                  className="h-16 w-16 object-contain" 
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">{invoice.organizationInfo.name}</h2>
                {invoice.organizationInfo.taxId && (
                  <p className="text-sm text-gray-500">EIN: {invoice.organizationInfo.taxId}</p>
                )}
                <p className="text-sm text-gray-500">(a 501(c) Non-Profit Organization)</p>
              </div>
            </div>
            <div className="bg-nonprofit-600 text-white px-8 py-6 rounded">
              <h1 className="text-3xl font-bold">Invoice</h1>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-500">From:</h3>
              <p className="font-medium">{invoice.organizationInfo.name}</p>
              <p className="whitespace-pre-line text-sm">{invoice.organizationInfo.address}</p>
              <p className="text-sm">{invoice.organizationInfo.email}</p>
              <p className="text-sm">{invoice.organizationInfo.phone}</p>
              {invoice.organizationInfo.website && (
                <p className="text-sm">{invoice.organizationInfo.website}</p>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-gray-500">Bill To:</h3>
              <p className="font-medium">{invoice.billTo.name}</p>
              <p className="whitespace-pre-line text-sm">{invoice.billTo.address}</p>
              {invoice.billTo.city && invoice.billTo.state && (
                <p className="text-sm">
                  {invoice.billTo.city}, {invoice.billTo.state} {invoice.billTo.zip}
                </p>
              )}
              {invoice.billTo.country && (
                <p className="text-sm">{invoice.billTo.country}</p>
              )}
              {invoice.billTo.email && (
                <p className="text-sm">Email: {invoice.billTo.email}</p>
              )}
              {invoice.billTo.phone && (
                <p className="text-sm">Phone: {invoice.billTo.phone}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-gray-500">Invoice Number</h3>
              <p className="font-medium">{invoice.invoiceNumber}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-gray-500">Invoice Date</h3>
              <p className="font-medium">{formatDate(invoice.date)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-gray-500">Due Date</h3>
              <p className="font-medium">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          <div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Item</th>
                  <th className="py-3 px-4 text-right font-semibold">Quantity</th>
                  <th className="py-3 px-4 text-right font-semibold">Price</th>
                  <th className="py-3 px-4 text-right font-semibold">Tax</th>
                  <th className="py-3 px-4 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 px-4">{item.description}</td>
                    <td className="py-4 px-4 text-right">{item.quantity}</td>
                    <td className="py-4 px-4 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right">{item.tax || 'N/A'}</td>
                    <td className="py-4 px-4 text-right">
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tax:</span>
                  <span>N/A</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="space-y-2">
              <h3 className="font-semibold">Notes</h3>
              <p className="text-sm whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          {invoice.paymentInfo && (
            <div className="space-y-2 bg-gray-50 p-4 rounded">
              <h3 className="font-semibold">Payment Information</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Wire Instructions</p>
                  <p>{invoice.paymentInfo.bankName}</p>
                  <p>{invoice.paymentInfo.address}</p>
                </div>
                <div>
                  <p>Account Name: {invoice.paymentInfo.accountName}</p>
                  <p>Account Number: {invoice.paymentInfo.accountNumber}</p>
                  <p>ABA Routing Number: {invoice.paymentInfo.routingNumber}</p>
                </div>
              </div>
              <p className="text-sm mt-4">For any questions, please contact us at {invoice.organizationInfo.email}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InvoicePreview;
