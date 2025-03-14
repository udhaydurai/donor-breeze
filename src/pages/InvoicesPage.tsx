
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useInvoice } from '@/context/InvoiceContext';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Eye, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';

const InvoicesPage = () => {
  const { invoices, deleteInvoice } = useInvoice();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MM/dd/yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  const handleDelete = (id: string) => {
    setSelectedInvoice(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedInvoice) {
      deleteInvoice(selectedInvoice);
      setDeleteDialogOpen(false);
      setSelectedInvoice(null);
    }
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.billTo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-gray-500 mt-1">
              Manage and track all your organization's invoices
            </p>
          </div>
          <Button asChild size="lg" className="gap-2">
            <Link to="/invoices/new">
              <Plus size={18} />
              Create New Invoice
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-gray-500 ml-auto">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </p>
        </div>

        {filteredInvoices.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Invoice #</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Date</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Due Date</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Client</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-500 text-sm">Amount</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-500 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredInvoices.map((invoice) => {
                  const total = invoice.items.reduce(
                    (sum, item) => sum + item.quantity * item.price,
                    0
                  );
                  
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50 smooth-transition">
                      <td className="py-3 px-4 text-sm">{invoice.invoiceNumber}</td>
                      <td className="py-3 px-4 text-sm">{formatDate(invoice.date)}</td>
                      <td className="py-3 px-4 text-sm">{formatDate(invoice.dueDate)}</td>
                      <td className="py-3 px-4 text-sm">{invoice.billTo.name}</td>
                      <td className="py-3 px-4 text-right text-sm">${total.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="ghost" size="icon">
                            <Link to={`/invoices/${invoice.id}`} title="View Invoice">
                              <Eye size={16} />
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" size="icon">
                            <Link to={`/invoices/edit/${invoice.id}`} title="Edit Invoice">
                              <Edit size={16} />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(invoice.id)}
                            title="Delete Invoice"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FileText size={28} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No invoices found</h3>
              {searchTerm ? (
                <p className="text-gray-500 mb-4">
                  No invoices matching "{searchTerm}" were found.
                </p>
              ) : (
                <p className="text-gray-500 mb-4">
                  Create your first invoice to get started.
                </p>
              )}
              {!searchTerm && (
                <Button asChild>
                  <Link to="/invoices/new">Create Your First Invoice</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this invoice? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default InvoicesPage;
