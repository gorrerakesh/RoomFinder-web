"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Home, Shield, Building, User, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    
    if (fullName && selectedRole) {
      localStorage.setItem('user', JSON.stringify({ name: fullName, email, role: selectedRole }));
    }
    
    if (selectedRole === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (selectedRole === 'OWNER') {
      router.push('/owner/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-primary-600 bg-card px-6 py-3 rounded-full shadow-sm border border-border hover:shadow-md transition-shadow">
            <Home className="h-6 w-6" />
            <span className="font-bold text-xl">RoomFinder</span>
          </Link>
        </div>

        {!selectedRole ? (
          <div className="bg-card rounded-3xl shadow-xl border border-border p-8 md:p-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Choose Your Role to Sign Up</h1>
            <p className="text-muted-foreground mb-10 text-lg max-w-xl mx-auto">
              Select what you want to do on RoomFinder to get started.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => setSelectedRole('CUSTOMER')}
                className="group flex flex-col items-center p-8 border-2 border-border rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-center focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
              >
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <User className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Customer</h3>
                <p className="text-sm text-muted-foreground">Search properties and manage rental requests.</p>
              </button>

              <button 
                onClick={() => setSelectedRole('OWNER')}
                className="group flex flex-col items-center p-8 border-2 border-border rounded-2xl hover:border-orange-500 hover:bg-orange-50/50 transition-all text-center focus:outline-none focus:ring-4 focus:ring-orange-500/20"
              >
                <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Property Owner</h3>
                <p className="text-sm text-muted-foreground">List new properties and view tenant enquiries.</p>
              </button>

              <button 
                onClick={() => setSelectedRole('ADMIN')}
                className="group flex flex-col items-center p-8 border-2 border-border rounded-2xl hover:border-slate-800 hover:bg-slate-50 transition-all text-center focus:outline-none focus:ring-4 focus:ring-slate-800/20"
              >
                <div className="w-20 h-20 bg-slate-200 text-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Administrator</h3>
                <p className="text-sm text-muted-foreground">Manage the platform and approve listings.</p>
              </button>
            </div>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary-600 hover:underline">
                Sign in here
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
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
                  {selectedRole === 'ADMIN' ? 'Create Admin Account' : 
                   selectedRole === 'OWNER' ? 'Create Owner Account' : 
                   'Create Customer Account'}
                </h1>
                <p className="text-muted-foreground mt-1">Start finding your perfect home today</p>
              </div>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-semibold mb-1.5 block text-foreground">Full Name</label>
                    <Input name="fullName" placeholder="John Doe" required />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-sm font-semibold mb-1.5 block text-foreground">Email address</label>
                    <Input name="email" type="email" placeholder="you@example.com" required />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-sm font-semibold mb-1.5 block text-foreground">Mobile Number</label>
                    <Input type="tel" placeholder="+91 9876543210" required />
                  </div>
                  
                  {selectedRole === 'CUSTOMER' && (
                    <div className="col-span-2">
                      <label className="text-sm font-semibold mb-1.5 block text-foreground">I am looking for</label>
                      <Select options={[
                        { label: "Family / House", value: "Family" },
                        { label: "Bachelor Accommodation", value: "Bachelor" },
                        { label: "Student PG / Hostel", value: "Student" },
                        { label: "Working Professional Flat", value: "Working Professional" },
                      ]} required />
                    </div>
                  )}
                  
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-sm font-semibold mb-1.5 block text-foreground">Password</label>
                    <Input type="password" placeholder="••••••••" required />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-sm font-semibold mb-1.5 block text-foreground">Confirm Password</label>
                    <Input type="password" placeholder="••••••••" required />
                  </div>
                </div>
                
                <div className="flex items-start gap-2 mt-4 pt-2">
                  <input type="checkbox" id="terms" className="rounded border-border text-primary-600 focus:ring-primary-500 mt-1" required />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                    I agree to the <Link href="#" className="text-primary-600 hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary-600 hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
                
                <Button type="submit" className="w-full h-12 text-lg font-bold mt-6">
                  Create Account
                </Button>
              </form>
              
              <div className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href={`/login?role=${selectedRole}`} className="font-semibold text-primary-600 hover:underline">
                  Sign in here
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
