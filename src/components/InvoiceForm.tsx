
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import InvoiceNumber from './InvoiceNumber';
import { InvoiceData, InvoiceItem } from '@/types';
import { useInvoice } from '@/context/InvoiceContext';
import { Trash2, Plus, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface InvoiceFormProps {
  initialData?: InvoiceData;
  isEditing?: boolean;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData, isEditing = false }) => {
  const navigate = useNavigate();
  const { addInvoice, updateInvoice, organizationSettings } = useInvoice();
  const today = format(new Date(), 'yyyy-MM-dd');
  const dueDate = format(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd');

  const [invoiceData, setInvoiceData] = useState<InvoiceData>(
    initialData || {
      id: uuidv4(),
      invoiceNumber: '',
      date: today,
      dueDate: dueDate,
      billTo: {
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
      items: [
        {
          id: uuidv4(),
          description: '',
          quantity: 1,
          price: 0,
        },
      ],
      notes: '',
      paymentInfo: {
        bankName: organizationSettings.bankName || '',
        accountName: organizationSettings.accountName || '',
        accountNumber: organizationSettings.accountNumber || '',
        routingNumber: organizationSettings.routingNumber || '',
        address: organizationSettings.bankAddress || '',
      },
      organizationInfo: {
        name: organizationSettings.name,
        address: organizationSettings.address,
        email: organizationSettings.email,
        phone: organizationSettings.phone,
        website: organizationSettings.website,
        taxId: organizationSettings.taxId,
      },
    }
  );

  const updateField = (field: string, value: any) => {
    setInvoiceData({ ...invoiceData, [field]: value });
  };

  const updateBillTo = (field: string, value: string) => {
    setInvoiceData({
      ...invoiceData,
      billTo: {
        ...invoiceData.billTo,
        [field]: value,
      },
    });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          id: uuidv4(),
          description: '',
          quantity: 1,
          price: 0,
        },
      ],
    });
  };

  const updateItem = (id: string, field: string, value: any) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const removeItem = (id: string) => {
    if (invoiceData.items.length === 1) {
      return; // Don't remove the last item
    }
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter((item) => item.id !== id),
    });
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateInvoice(invoiceData.id, invoiceData);
    } else {
      addInvoice(invoiceData);
    }
    navigate('/invoices');
  };

  const isFormValid = () => {
    return (
      invoiceData.invoiceNumber &&
      invoiceData.billTo.name &&
      invoiceData.items.every(item => 
        item.description && 
        item.quantity > 0 && 
        item.price > 0
      )
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-xl">Invoice Details</h3>
            <Separator />
            <InvoiceNumber
              value={invoiceData.invoiceNumber}
              onChange={(value) => updateField('invoiceNumber', value)}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Invoice Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={invoiceData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-xl">Bill To</h3>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="clientName">Client/Company Name</Label>
              <Input
                id="clientName"
                value={invoiceData.billTo.name}
                onChange={(e) => updateBillTo('name', e.target.value)}
                placeholder="Enter client name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Address</Label>
              <Textarea
                id="clientAddress"
                value={invoiceData.billTo.address}
                onChange={(e) => updateBillTo('address', e.target.value)}
                placeholder="Enter street address"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientCity">City</Label>
                <Input
                  id="clientCity"
                  value={invoiceData.billTo.city}
                  onChange={(e) => updateBillTo('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientState">State</Label>
                <Input
                  id="clientState"
                  value={invoiceData.billTo.state}
                  onChange={(e) => updateBillTo('state', e.target.value)}
                  placeholder="State/Province"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientZip">Zip Code</Label>
                <Input
                  id="clientZip"
                  value={invoiceData.billTo.zip}
                  onChange={(e) => updateBillTo('zip', e.target.value)}
                  placeholder="Zip/Postal Code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCountry">Country</Label>
                <Input
                  id="clientCountry"
                  value={invoiceData.billTo.country}
                  onChange={(e) => updateBillTo('country', e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <h3 className="font-semibold text-xl">Line Items</h3>
          <Separator />
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-500">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-1">Tax</div>
              <div className="col-span-1">Actions</div>
            </div>
            <Separator />
            {invoiceData.items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-center line-item smooth-transition p-2 rounded">
                <div className="col-span-6">
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, 'description', e.target.value)
                    }
                    placeholder="Item description"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(item.id, 'price', parseFloat(e.target.value) || 0)
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="text"
                    value={item.tax !== undefined ? item.tax : 'N/A'}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateItem(
                        item.id,
                        'tax',
                        value === 'N/A' ? undefined : value
                      );
                    }}
                    placeholder="N/A"
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={invoiceData.items.length === 1}
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              className="mt-2"
            >
              <Plus size={16} className="mr-1" /> Add Item
            </Button>
          </div>

          <div className="flex justify-end mt-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-xl">Additional Information</h3>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={invoiceData.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Enter any additional notes or payment instructions"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/invoices')}
        >
          Cancel
        </Button>
        <div className="flex items-center gap-2">
          {!isFormValid() && (
            <div className="flex items-center text-amber-600 text-sm">
              <AlertCircle size={14} className="mr-1" />
              Please fill in all required fields
            </div>
          )}
          <Button type="submit" disabled={!isFormValid()}>
            {isEditing ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;
