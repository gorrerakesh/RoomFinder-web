"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Shield, Building, User, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    if (email && selectedRole) {
      const name = email.split('@')[0];
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      localStorage.setItem('user', JSON.stringify({ name: capitalized, email, role: selectedRole }));
    }
    
    // Redirect based on role
    if (selectedRole === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (selectedRole === 'OWNER') {
      router.push('/owner/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-primary-600 bg-card px-6 py-3 rounded-full shadow-sm border border-border hover:shadow-md transition-shadow">
            <Home className="h-6 w-6" />
            <span className="font-bold text-xl">RoomFinder</span>
          </Link>
        </div>

        {!selectedRole ? (
          <div className="bg-card rounded-3xl shadow-xl border border-border p-8 md:p-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Choose Your Portal</h1>
            <p className="text-muted-foreground mb-10 text-lg max-w-xl mx-auto">
              Select your role to access the specific features and dashboard tailored for your needs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Customer Card */}
              <button 
                onClick={() => setSelectedRole('CUSTOMER')}
                className="group flex flex-col items-center p-8 border-2 border-border rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-center focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
              >
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <User className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Customer</h3>
                <p className="text-sm text-muted-foreground">Search properties, save favorites, and manage rental requests.</p>
              </button>

              {/* Owner Card */}
              <button 
                onClick={() => setSelectedRole('OWNER')}
                className="group flex flex-col items-center p-8 border-2 border-border rounded-2xl hover:border-orange-500 hover:bg-orange-50/50 transition-all text-center focus:outline-none focus:ring-4 focus:ring-orange-500/20"
              >
                <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Property Owner</h3>
                <p className="text-sm text-muted-foreground">List new properties, manage listings, and view tenant enquiries.</p>
              </button>

              {/* Admin Card */}
              <button 
                onClick={() => setSelectedRole('ADMIN')}
                className="group flex flex-col items-center p-8 border-2 border-border rounded-2xl hover:border-slate-800 hover:bg-slate-50 transition-all text-center focus:outline-none focus:ring-4 focus:ring-slate-800/20"
              >
                <div className="w-20 h-20 bg-slate-200 text-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Administrator</h3>
                <p className="text-sm text-muted-foreground">System control, user management, and property approvals.</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="p-8">
              <button 
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Roles
              </button>
              
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-primary-100 text-primary-600">
                  {selectedRole === 'ADMIN' ? <Shield className="w-8 h-8" /> : 
                   selectedRole === 'OWNER' ? <Building className="w-8 h-8" /> : 
                   <User className="w-8 h-8" />}
                </div>
                <h1 className="text-2xl font-bold">
                  {selectedRole === 'ADMIN' ? 'Admin Login' : 
                   selectedRole === 'OWNER' ? 'Owner Login' : 
                   'Customer Login'}
                </h1>
                <p className="text-muted-foreground mt-1">Please enter your details to sign in</p>
              </div>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block text-foreground">Email address</label>
                  <Input name="email" type="email" placeholder="you@example.com" required />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-foreground">Password</label>
                    <Link href="#" className="text-sm font-medium text-primary-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input type="password" placeholder="••••••••" required />
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="remember" className="rounded border-border text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember me for 30 days</label>
                </div>
                
                <Button type="submit" className="w-full h-12 text-lg font-bold mt-6">
                  Sign In
                </Button>
              </form>
              
              <div className="mt-8 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href={`/register?role=${selectedRole}`} className="font-semibold text-primary-600 hover:underline">
                  Sign up for free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
