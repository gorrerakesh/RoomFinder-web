"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, Building, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PropertyCard } from '@/components/property/PropertyCard';
import mockProperties from '@/data/properties.json';

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('buy');
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Merge mock data with local storage properties
    const storedProps = JSON.parse(localStorage.getItem('listedProperties') || '[]');
    setProperties([...storedProps, ...mockProperties].slice(0, 3)); // Only show top 3 featured
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const city = formData.get('city');
    const type = formData.get('type');
    
    // Convert intent "buy/rent" to query param if needed, or just standard search
    const searchParams = new URLSearchParams();
    if (city) searchParams.append('city', city);
    if (type) searchParams.append('type', type);
    
    router.push(`/properties?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-background to-secondary-50 -z-10" />
        
        {/* Abstract background shapes */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary-200/40 rounded-full blur-3xl -z-10 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-200/40 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-foreground max-w-4xl mx-auto leading-tight">
            Find your perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">space</span> to live and thrive
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Discover thousands of rooms, apartments, and houses for rent in your preferred location. Fast, easy, and secure.
          </p>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-xl border border-border p-3">
            <div className="flex gap-4 mb-4 px-3 pt-2">
              <button 
                onClick={() => setActiveTab('rent')}
                className={`font-semibold pb-2 px-2 border-b-2 transition-colors ${activeTab === 'rent' ? 'border-primary-600 text-primary-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Rent
              </button>
              <button 
                onClick={() => setActiveTab('buy')}
                className={`font-semibold pb-2 px-2 border-b-2 transition-colors ${activeTab === 'buy' ? 'border-primary-600 text-primary-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Buy
              </button>
              <button 
                onClick={() => setActiveTab('pg')}
                className={`font-semibold pb-2 px-2 border-b-2 transition-colors ${activeTab === 'pg' ? 'border-primary-600 text-primary-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                PG/Co-living
              </button>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative flex items-center">
                <MapPin className="absolute left-4 text-muted-foreground w-5 h-5" />
                <Input name="city" placeholder="Enter City, Locality, or Landmark" className="pl-12 h-14 text-lg border-muted bg-muted/30" />
              </div>
              <div className="w-full md:w-64 relative flex items-center">
                <Home className="absolute left-4 text-muted-foreground w-5 h-5 z-10" />
                <Select name="type" className="pl-12 h-14 text-lg border-muted bg-muted/30" options={[
                  { label: 'Property Type', value: '' },
                  { label: 'Apartment', value: 'Apartment' },
                  { label: 'Independent House', value: 'Independent House' },
                  { label: 'Villa', value: 'Villa' },
                  { label: 'Studio', value: 'Studio' }
                ]} />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 text-lg w-full md:w-auto">
                <Search className="w-5 h-5 mr-2" /> Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-3">Featured Properties</h2>
              <p className="text-muted-foreground">Handpicked spaces tailored for your lifestyle.</p>
            </div>
            <Link href="/properties">
              <Button variant="ghost" className="hidden md:flex gap-2">View all <ChevronRight className="w-4 h-4" /></Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/properties">
              <Button variant="outline" className="w-full">View all properties</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How RoomFinder Works</h2>
            <p className="text-muted-foreground">Your journey to the perfect home is just three simple steps away.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10" />

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-card border border-border shadow-sm rounded-2xl flex items-center justify-center mb-6 relative">
                <Search className="w-10 h-10 text-primary-600" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-background">1</div>
              </div>
              <h3 className="text-xl font-bold mb-3">Search</h3>
              <p className="text-muted-foreground">Use our smart filters to find properties that match your specific needs and budget.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-card border border-border shadow-sm rounded-2xl flex items-center justify-center mb-6 relative">
                <Building className="w-10 h-10 text-secondary-500" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center font-bold border-4 border-background">2</div>
              </div>
              <h3 className="text-xl font-bold mb-3">Visit</h3>
              <p className="text-muted-foreground">Schedule a visit online. Meet the owner directly and inspect the property.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-card border border-border shadow-sm rounded-2xl flex items-center justify-center mb-6 relative">
                <Shield className="w-10 h-10 text-emerald-500" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold border-4 border-background">3</div>
              </div>
              <h3 className="text-xl font-bold mb-3">Move In</h3>
              <p className="text-muted-foreground">Complete the paperwork securely through our platform and get your keys.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
