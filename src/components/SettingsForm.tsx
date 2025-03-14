
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrganizationSettings } from '@/types';
import { useInvoice } from '@/context/InvoiceContext';

const SettingsForm: React.FC = () => {
  const { organizationSettings, updateOrganizationSettings } = useInvoice();
  const [settings, setSettings] = useState<OrganizationSettings>(organizationSettings);
  const [logo, setLogo] = useState<string | undefined>(organizationSettings.logo);

  const handleChange = (field: keyof OrganizationSettings, value: string) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogo(result);
        setSettings({ ...settings, logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganizationSettings({ ...settings, logo });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-xl">Organization Information</h3>
          <Separator />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="organizationLogo">Organization Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border rounded flex items-center justify-center overflow-hidden bg-gray-50">
                  {logo ? (
                    <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <p className="text-sm text-gray-400">No logo</p>
                  )}
                </div>
                <Input
                  id="organizationLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="max-w-xs"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Upload a logo to display on your invoices (PNG or JPEG recommended)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                value={settings.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Your Organization Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationAddress">Address</Label>
              <Textarea
                id="organizationAddress"
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Organization address"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizationEmail">Email</Label>
                <Input
                  id="organizationEmail"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contact@organization.org"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizationPhone">Phone</Label>
                <Input
                  id="organizationPhone"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizationWebsite">Website</Label>
                <Input
                  id="organizationWebsite"
                  value={settings.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="www.organization.org"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizationTaxId">Tax ID / EIN</Label>
                <Input
                  id="organizationTaxId"
                  value={settings.taxId || ''}
                  onChange={(e) => handleChange('taxId', e.target.value)}
                  placeholder="XX-XXXXXXX"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-xl">Payment Information</h3>
          <Separator />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={settings.bankName || ''}
                onChange={(e) => handleChange('bankName', e.target.value)}
                placeholder="Bank Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={settings.accountName || ''}
                onChange={(e) => handleChange('accountName', e.target.value)}
                placeholder="Account Name"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={settings.accountNumber || ''}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  placeholder="Account Number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  value={settings.routingNumber || ''}
                  onChange={(e) => handleChange('routingNumber', e.target.value)}
                  placeholder="Routing Number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAddress">Bank Address</Label>
              <Textarea
                id="bankAddress"
                value={settings.bankAddress || ''}
                onChange={(e) => handleChange('bankAddress', e.target.value)}
                placeholder="Bank Address"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  );
};

export default SettingsForm;
