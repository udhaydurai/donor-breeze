
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InvoiceNumberProps {
  value: string;
  onChange: (value: string) => void;
}

const InvoiceNumber: React.FC<InvoiceNumberProps> = ({ value, onChange }) => {
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newInvoiceNumber = `${year}-${randomDigits}`;
    onChange(newInvoiceNumber);
  };

  React.useEffect(() => {
    if (!value) {
      generateInvoiceNumber();
    }
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="invoiceNumber">Invoice Number</Label>
        <button
          type="button"
          onClick={generateInvoiceNumber}
          className="text-sm text-nonprofit-600 hover:text-nonprofit-700"
        >
          Generate New
        </button>
      </div>
      <Input
        id="invoiceNumber"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="INV-2023-12345"
      />
    </div>
  );
};

export default InvoiceNumber;
