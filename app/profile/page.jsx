"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState({ name: 'User', email: 'user@example.com', phone: '+91 9876543210' });
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({ ...user, ...parsed });
      } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify(user));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    window.dispatchEvent(new Event('storage'));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const updated = { ...user, profilePic: event.target.result };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[calc(100vh-64px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border flex flex-col sm:flex-row items-center gap-8">
          <div className="relative group cursor-pointer" onClick={() => document.getElementById('profilePicUpload').click()}>
            {user?.profilePic ? (
              <img src={user.profilePic} alt={user?.name} className="w-32 h-32 rounded-full object-cover border-4 border-muted shadow-sm" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-5xl uppercase border-4 border-muted shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-sm font-medium backdrop-blur-sm">
              <Camera className="w-6 h-6 mb-1" />
              Upload Photo
            </div>
            <input 
              type="file" 
              id="profilePicUpload" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload} 
            />
          </div>
          
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Email Verified</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Phone Verified</span>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <h3 className="text-xl font-bold mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  className="pl-9" 
                  value={user.name || ''} 
                  onChange={(e) => setUser({...user, name: e.target.value})} 
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  className="pl-9" 
                  value={user.email || ''} 
                  onChange={(e) => setUser({...user, email: e.target.value})} 
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  className="pl-9" 
                  value={user.phone || ''} 
                  onChange={(e) => setUser({...user, phone: e.target.value})} 
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">Current City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  className="pl-9" 
                  placeholder="e.g. Hyderabad"
                  value={user.city || ''} 
                  onChange={(e) => setUser({...user, city: e.target.value})} 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end items-center gap-4 border-t border-border pt-6">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
            <Button onClick={handleSave} className="min-w-[120px]">
              {isSaved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
