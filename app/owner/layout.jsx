import React from 'react';
import Link from 'next/link';
import { Home, Building, Plus, MessageSquare, TrendingUp } from 'lucide-react';

export default function OwnerDashboardLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-64px)]">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-primary-900 text-white rounded-xl p-4 sticky top-24 shadow-sm border border-primary-800">
            <div className="flex items-center gap-3 p-4 mb-4 border-b border-primary-800/50">
              <div className="w-12 h-12 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-xl">
                O
              </div>
              <div>
                <h3 className="font-bold">Owner Portal</h3>
                <p className="text-xs text-primary-200">Verified Owner</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <Link href="/owner/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors">
                <TrendingUp className="w-5 h-5 text-primary-300" /> Overview
              </Link>
              <Link href="/owner/properties" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors">
                <Building className="w-5 h-5 text-primary-300" /> My Properties
              </Link>
              <Link href="/owner/properties/add" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors">
                <Plus className="w-5 h-5 text-primary-300" /> List New Property
              </Link>
              <Link href="/owner/enquiries" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors">
                <MessageSquare className="w-5 h-5 text-primary-300" /> Tenant Enquiries
              </Link>
              
              <div className="my-4 border-t border-primary-800/50"></div>
              
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors">
                <Home className="w-5 h-5 text-primary-300" /> Tenant View
              </Link>
            </nav>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
