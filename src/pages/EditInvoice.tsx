
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import InvoiceForm from '@/components/InvoiceForm';
import { useInvoice } from '@/context/InvoiceContext';

const EditInvoice = () => {
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
          <h1 className="text-3xl font-bold">Edit Invoice</h1>
          <p className="text-gray-500 mt-1">
            Update the details of invoice #{invoice.invoiceNumber}
          </p>
        </div>
        <InvoiceForm initialData={invoice} isEditing={true} />
      </div>
    </Layout>
  );
};

export default EditInvoice;
