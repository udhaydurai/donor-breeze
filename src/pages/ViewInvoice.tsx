
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import InvoicePreview from '@/components/InvoicePreview';
import { useInvoice } from '@/context/InvoiceContext';

const ViewInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const { getInvoice } = useInvoice();
  
  const invoice = id ? getInvoice(id) : undefined;
  
  if (!invoice) {
    return <Navigate to="/invoices" />;
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Invoice {invoice.invoiceNumber}</h1>
          <p className="text-gray-500 mt-1">
            View, print, or download this invoice
          </p>
        </div>
        <InvoicePreview invoice={invoice} />
      </div>
    </Layout>
  );
};

export default ViewInvoice;
