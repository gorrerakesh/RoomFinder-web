"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home as HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PropertyCard } from '@/components/property/PropertyCard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import mockProperties from '@/data/properties.json';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("John");
  const [properties, setProperties] = useState([]);
  const [favoriteProperties, setFavoriteProperties] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) setUserName(parsed.name);
      } catch (e) {}
    }

    // Merge mock data with local storage properties
    const storedProps = JSON.parse(localStorage.getItem('listedProperties') || '[]');
    const allProps = [...storedProps, ...mockProperties];
    
    // Set Latest Properties
    setProperties(allProps.slice(0, 6));

    // Get Favorites
    const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favProps = allProps.filter(p => savedFavs.includes(p.id));
    setFavoriteProperties(favProps);

  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const city = formData.get('city');
    const type = formData.get('type');
    
    const searchParams = new URLSearchParams();
    if (city) searchParams.append('city', city);
    if (type) searchParams.append('type', type);
    
    router.push(`/properties?${searchParams.toString()}`);
  };

  return (
    <RoleGuard allowedRoles={['CUSTOMER']}>
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {userName} 👋</h1>
        <p className="text-muted-foreground mb-8">Ready to find your next home?</p>
        
        {/* Search Bar Section */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 mb-10">
          <h2 className="text-lg font-bold mb-4">Quick Search</h2>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative flex items-center">
              <MapPin className="absolute left-4 text-muted-foreground w-5 h-5" />
              <Input name="city" placeholder="Enter City, Locality, or Landmark" className="pl-12 h-14 text-base border-muted bg-muted/30" />
            </div>
            <div className="w-full md:w-64 relative flex items-center">
              <HomeIcon className="absolute left-4 text-muted-foreground w-5 h-5 z-10" />
              <Select name="type" className="pl-12 h-14 text-base border-muted bg-muted/30" options={[
                { label: 'Property Type', value: '' },
                { label: 'Apartment', value: 'Apartment' },
                { label: 'Independent House', value: 'Independent House' },
                { label: 'Villa', value: 'Villa' },
                { label: 'Studio', value: 'Studio' },
                { label: '1 BHK', value: '1 BHK' },
                { label: '2 BHK', value: '2 BHK' },
                { label: '3 BHK', value: '3 BHK' },
                { label: 'PG / Hostel', value: 'PG' }
              ]} />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8 text-base w-full md:w-auto">
              <Search className="w-5 h-5 mr-2" /> Search
            </Button>
          </form>
        </div>

        {/* Favorite Properties */}
        {favoriteProperties.length > 0 && (
          <div className="mb-10">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl font-bold">Your Saved Favorites</h2>
              <Link href="/favorites" className="text-sm text-primary-600 hover:underline font-medium">View all</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.slice(0, 3).map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        )}

        {/* Latest Properties */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold">Latest Properties</h2>
            <Link href="/properties" className="text-sm text-primary-600 hover:underline font-medium">Browse all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>

      </div>
    </RoleGuard>
  );
}
