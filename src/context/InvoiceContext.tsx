
import React, { createContext, useContext, useState, useEffect } from 'react';
import { InvoiceData, OrganizationSettings } from '@/types';
import { toast } from "sonner";

interface InvoiceContextType {
  invoices: InvoiceData[];
  addInvoice: (invoice: InvoiceData) => void;
  updateInvoice: (id: string, invoice: InvoiceData) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => InvoiceData | undefined;
  organizationSettings: OrganizationSettings;
  updateOrganizationSettings: (settings: OrganizationSettings) => void;
}

const defaultOrganizationSettings: OrganizationSettings = {
  name: 'San Diego Tamil Sangam',
  address: '123 Nonprofit Way, San Diego, CA 92101',
  email: 'contact@sdtamilsangam.org',
  phone: '(555) 123-4567',
  website: 'www.sdtamilsangam.org',
  taxId: '20-3151534',
  bankName: 'San Diego County Credit Union',
  accountName: 'San Diego Tamil Sangam, Inc.',
  accountNumber: '000264263890',
  routingNumber: '3222-8161-7',
  bankAddress: '6545 Sequence Drive, San Diego, CA 92121'
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<InvoiceData[]>(() => {
    const savedInvoices = localStorage.getItem('invoices');
    return savedInvoices ? JSON.parse(savedInvoices) : [];
  });

  const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings>(() => {
    const savedSettings = localStorage.getItem('organizationSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultOrganizationSettings;
  });

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('organizationSettings', JSON.stringify(organizationSettings));
  }, [organizationSettings]);

  const addInvoice = (invoice: InvoiceData) => {
    setInvoices([...invoices, invoice]);
    toast.success("Invoice created successfully");
  };

  const updateInvoice = (id: string, invoice: InvoiceData) => {
    setInvoices(invoices.map(inv => inv.id === id ? invoice : inv));
    toast.success("Invoice updated successfully");
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    toast.success("Invoice deleted successfully");
  };

  const getInvoice = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  const updateOrganizationSettings = (settings: OrganizationSettings) => {
    setOrganizationSettings(settings);
    toast.success("Organization settings updated successfully");
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoice,
        organizationSettings,
        updateOrganizationSettings
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};
