
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInvoice } from '@/context/InvoiceContext';
import { Plus, FileText, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { invoices } = useInvoice();
  
  const recentInvoices = invoices.slice(0, 5);
  
  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome to InvoiceGen</h1>
            <p className="text-gray-500 mt-1">
              Create professional invoices for your non-profit organization
            </p>
          </div>
          <Button asChild size="lg" className="gap-2">
            <Link to="/invoices/new">
              <Plus size={18} />
              Create New Invoice
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="invoice-animation-container">
            <CardContent className="p-6 invoice-animation">
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-nonprofit-100 flex items-center justify-center">
                  <FileText size={24} className="text-nonprofit-600" />
                </div>
                <h3 className="font-medium text-lg">Manage Invoices</h3>
                <p className="text-sm text-gray-500">
                  Create, view, and manage all your organization's invoices
                </p>
                <Button asChild variant="outline" className="mt-2">
                  <Link to="/invoices">View All Invoices</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="invoice-animation-container">
            <CardContent className="p-6 invoice-animation">
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-nonprofit-100 flex items-center justify-center">
                  <Plus size={24} className="text-nonprofit-600" />
                </div>
                <h3 className="font-medium text-lg">Create New Invoice</h3>
                <p className="text-sm text-gray-500">
                  Generate a new invoice for sponsors or donors
                </p>
                <Button asChild variant="outline" className="mt-2">
                  <Link to="/invoices/new">Create Invoice</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="invoice-animation-container">
            <CardContent className="p-6 invoice-animation">
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-nonprofit-100 flex items-center justify-center">
                  <Settings size={24} className="text-nonprofit-600" />
                </div>
                <h3 className="font-medium text-lg">Organization Settings</h3>
                <p className="text-sm text-gray-500">
                  Update your organization's details and payment information
                </p>
                <Button asChild variant="outline" className="mt-2">
                  <Link to="/settings">Update Settings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Invoices</h2>
            <Button variant="ghost" asChild size="sm">
              <Link to="/invoices">View All</Link>
            </Button>
          </div>
          
          {recentInvoices.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Invoice #</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Date</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Client</th>
                    <th className="py-3 px-4 text-right font-medium text-gray-500 text-sm">Amount</th>
                    <th className="py-3 px-4 text-right font-medium text-gray-500 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentInvoices.map((invoice) => {
                    const total = invoice.items.reduce(
                      (sum, item) => sum + item.quantity * item.price,
                      0
                    );
                    
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50 smooth-transition">
                        <td className="py-3 px-4 text-sm">{invoice.invoiceNumber}</td>
                        <td className="py-3 px-4 text-sm">{invoice.date}</td>
                        <td className="py-3 px-4 text-sm">{invoice.billTo.name}</td>
                        <td className="py-3 px-4 text-right text-sm">${total.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/invoices/${invoice.id}`}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No invoices created yet</p>
                <Button asChild className="mt-4">
                  <Link to="/invoices/new">Create Your First Invoice</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
