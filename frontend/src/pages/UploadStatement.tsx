import React from 'react';
import StatementUploader from '../components/StatementUploader';

const UploadStatement: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Statement</h1>
          <div className="bg-white rounded-lg shadow-sm">
            <StatementUploader />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStatement; 