"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Heart, MessageSquare, Settings, LogOut, Clock, PlusCircle } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState({ name: 'John Doe', email: 'user@example.com' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({ ...user, ...parsed });
      } catch (e) {}
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-64px)]">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-card border border-border rounded-xl p-4 sticky top-24 shadow-sm">
            <div className="flex items-center gap-3 p-4 mb-4 border-b border-border">
              {user?.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-muted" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="overflow-hidden">
                <h3 className="font-bold truncate">{user.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted text-foreground transition-colors">
                <Home className="w-5 h-5 text-muted-foreground" /> Overview
              </Link>
              <Link href="/favorites" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted text-foreground transition-colors">
                <Heart className="w-5 h-5 text-muted-foreground" /> My Favorites
              </Link>
              <Link href="/dashboard/enquiries" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted text-foreground transition-colors">
                <MessageSquare className="w-5 h-5 text-muted-foreground" /> Enquiries & Visits
              </Link>
              <Link href="/dashboard/searches" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted text-foreground transition-colors">
                <Clock className="w-5 h-5 text-muted-foreground" /> Recent Searches
              </Link>
              
              <div className="my-4 border-t border-border"></div>
              
              <Link href="/owner/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-50 text-primary-700 transition-colors">
                <PlusCircle className="w-5 h-5 text-primary-600" /> Owner Portal
              </Link>
              <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted text-foreground transition-colors">
                <Settings className="w-5 h-5 text-muted-foreground" /> Profile Settings
              </Link>
              <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-50 text-red-600 transition-colors mt-8">
                <LogOut className="w-5 h-5" /> Sign Out
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
