
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  tax?: number;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  billTo: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    email?: string;
    phone?: string;
  };
  items: InvoiceItem[];
  notes?: string;
  paymentInfo?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    address: string;
  };
  organizationInfo: {
    name: string;
    address: string;
    email: string;
    phone: string;
    website?: string;
    taxId?: string;
  };
}

export interface OrganizationSettings {
  name: string;
  address: string;
  email: string;
  phone: string;
  website?: string;
  taxId?: string;
  logo?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  routingNumber?: string;
  bankAddress?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
