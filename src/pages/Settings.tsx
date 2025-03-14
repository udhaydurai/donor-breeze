
import React from 'react';
import Layout from '@/components/Layout';
import SettingsForm from '@/components/SettingsForm';

const Settings = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Organization Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your organization's information and payment details
          </p>
        </div>
        <SettingsForm />
      </div>
    </Layout>
  );
};

export default Settings;
