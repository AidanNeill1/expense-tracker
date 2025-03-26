import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../services/api';

const StatementUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setSuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB max file size to match backend limit
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to upload statements');
      }

      const response = await api.post('/upload-transactions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        setFile(null);
      } else {
        throw new Error('Upload failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to upload statement. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="text-gray-600">
            {isDragActive ? (
              <p>Drop the PDF statement here...</p>
            ) : (
              <p>Drag and drop your PDF statement here, or click to select a file</p>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Supported format: PDF only
            <br />
            Maximum file size: 5MB
          </div>
        </div>
      </div>

      {file && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-gray-700">{file.name}</span>
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${uploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
          Statement uploaded successfully!
        </div>
      )}
    </div>
  );
};

export default StatementUploader; 