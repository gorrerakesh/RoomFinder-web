"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Search, Heart, User, LogIn, Menu, Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) {
          setUser(parsed);
          setIsLoggedIn(true);
        }
      } catch (e) {}
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-primary-600">
            <Home className="h-6 w-6" />
            <span className="font-bold text-xl hidden sm:inline-block">RoomFinder</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {(!isLoggedIn || user?.role === 'CUSTOMER') && (
            <>
              <Link href="/properties" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Search className="w-4 h-4" /> Properties
              </Link>
              <Link href="/favorites" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Heart className="w-4 h-4" /> Favorites
              </Link>
            </>
          )}

          {isLoggedIn && user?.role === 'OWNER' && (
            <>
              <Link href="/owner/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" /> Owner Dashboard
              </Link>
              <Link href="/owner/properties" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Search className="w-4 h-4" /> My Properties
              </Link>
            </>
          )}

          {isLoggedIn && user?.role === 'ADMIN' && (
            <>
              <Link href="/admin/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" /> Admin Dashboard
              </Link>
              <Link href="/admin/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <User className="w-4 h-4" /> Approvals
              </Link>
            </>
          )}
          
          <div className="w-px h-6 bg-border mx-2"></div>
          
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-sm font-medium flex items-center gap-2 hover:bg-muted/50 p-1.5 pr-3 rounded-full transition-colors"
              >
                {user?.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span>My Account</span>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden py-1 z-50">
                  <Link href={user?.role === 'ADMIN' ? '/admin/dashboard' : user?.role === 'OWNER' ? '/owner/dashboard' : '/dashboard'} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted" onClick={() => setIsDropdownOpen(false)}>
                    <User className="w-4 h-4" /> Dashboard
                  </Link>
                  <button 
                    onClick={() => { setIsDropdownOpen(false); setIsProfileModalOpen(true); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted"
                  >
                    <Settings className="w-4 h-4" /> Profile Settings
                  </button>
                  <div className="border-t border-border my-1"></div>
                  <button 
                    onClick={() => { 
                      localStorage.removeItem('user'); 
                      window.location.href = '/'; 
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden lg:flex">Log In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Navigation Toggle */}
        <button className="md:hidden p-2 text-foreground">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Profile Settings Modal */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Profile Settings">
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 pt-2">
            <div className="relative group cursor-pointer" onClick={() => document.getElementById('profilePicUpload').click()}>
              {user?.profilePic ? (
                <img src={user.profilePic} alt={user?.name} className="w-24 h-24 rounded-full object-cover border-4 border-muted" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-3xl uppercase border-4 border-muted">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold backdrop-blur-sm">
                Upload Photo
              </div>
              <input 
                type="file" 
                id="profilePicUpload" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const updated = { ...user, profilePic: event.target.result };
                      setUser(updated);
                      localStorage.setItem('user', JSON.stringify(updated));
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
            </div>
            <p className="text-xs text-muted-foreground">Click the image to upload a new profile picture.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1 block">Full Name</label>
              <Input 
                value={user?.name || ''} 
                onChange={(e) => {
                  const updated = { ...user, name: e.target.value };
                  setUser(updated);
                  localStorage.setItem('user', JSON.stringify(updated));
                }} 
              />
            </div>
          </div>
          
          <Button className="w-full mt-4" onClick={() => setIsProfileModalOpen(false)}>Save Changes</Button>
        </div>
      </Modal>
    </header>
  );
}
