
import React from 'react';
import Layout from '@/components/Layout';
import InvoiceForm from '@/components/InvoiceForm';

const NewInvoice = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Invoice</h1>
          <p className="text-gray-500 mt-1">
            Fill in the details to generate a new invoice
          </p>
        </div>
        <InvoiceForm />
      </div>
    </Layout>
  );
};

export default NewInvoice;
