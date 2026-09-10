"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, Home, ArrowRight } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/Button';
import propertiesData from '@/data/properties.json';

const allProperties = propertiesData;

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();
  
  if (!isLoaded) return null; // Or a skeleton loader
  
  const favoriteProperties = allProperties.filter(p => favorites.includes(p.id));

  return (
    <div className="bg-muted/20 min-h-[calc(100vh-64px)] py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-100 text-red-500 rounded-xl">
            <Heart className="w-6 h-6" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Favorites</h1>
            <p className="text-muted-foreground">{favoriteProperties.length} saved properties</p>
          </div>
        </div>

        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {favoriteProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-card border border-border rounded-xl py-20 px-4 text-center shadow-sm">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No favorites yet</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              Keep track of properties you love by clicking the heart icon on any property card. They'll be saved here for easy access.
            </p>
            <Link href="/properties">
              <Button size="lg" className="gap-2">
                <Home className="w-4 h-4" /> Browse Properties <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
