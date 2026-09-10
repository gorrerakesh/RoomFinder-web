import React, { Suspense } from 'react';
import { PropertiesClient } from './PropertiesClient';
import { Search } from 'lucide-react';

export default function PropertiesPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-muted/30">
      <div className="bg-primary-900 text-white py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
            <Search className="w-8 h-8" />
            Find Properties
          </h1>
          <p className="text-primary-200">Filter and search to find exactly what you're looking for.</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>}>
          <PropertiesClient />
        </Suspense>
      </div>
    </div>
  );
}
