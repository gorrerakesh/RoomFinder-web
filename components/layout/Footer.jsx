"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export function Footer() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-primary-600">
              <Home className="h-6 w-6" />
              <span className="font-bold text-xl">RoomFinder</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Find a place you'll love to live. The most trusted platform for finding rooms, flats, and houses for rent.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm font-semibold text-muted-foreground hover:text-primary-600">Facebook</a>
              <a href="#" className="text-sm font-semibold text-muted-foreground hover:text-primary-600">Twitter</a>
              <a href="#" className="text-sm font-semibold text-muted-foreground hover:text-primary-600">Instagram</a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/properties" className="hover:text-primary-600 transition-colors">Search Properties</Link></li>
              
              {(!user || user.role === 'OWNER' || user.role === 'ADMIN') && (
                <li><Link href="/owner/dashboard" className="hover:text-primary-600 transition-colors">Owner Portal</Link></li>
              )}
              
              {!user && (
                <li><Link href="/login" className="hover:text-primary-600 transition-colors">Sign In</Link></li>
              )}
              
              {(!user || user.role === 'CUSTOMER') && (
                <li><Link href="/favorites" className="hover:text-primary-600 transition-colors">Favorites</Link></li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Popular Cities</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/properties?city=Hyderabad" className="hover:text-primary-600 transition-colors">Hyderabad</Link></li>
              <li><Link href="/properties?city=Bengaluru" className="hover:text-primary-600 transition-colors">Bengaluru</Link></li>
              <li><Link href="/properties?city=Mumbai" className="hover:text-primary-600 transition-colors">Mumbai</Link></li>
              <li><Link href="/properties?city=Pune" className="hover:text-primary-600 transition-colors">Pune</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Help Center</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} RoomFinder. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Made with ❤️ for renters</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
