"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Square, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';

export function PropertyCard({ property, className }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.id);

  return (
    <div className={cn("group rounded-xl border border-border bg-card text-card-foreground overflow-hidden hover-lift flex flex-col h-full", className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Link href={`/properties/${property.id}`} className="block w-full h-full">
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background/90 text-foreground shadow-sm backdrop-blur-sm">
            {property.propertyType}
          </span>
          {property.isPopular && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 shadow-sm backdrop-blur-sm">
              Popular
            </span>
          )}
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors shadow-sm z-10",
            favorited ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-background/50 hover:bg-background/90 text-foreground"
          )}
        >
          <Heart className="w-5 h-5" fill={favorited ? "currentColor" : "none"} />
        </button>
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
            1/{property.images.length}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <Link href={`/properties/${property.id}`} className="flex-1 hover:text-primary-600 transition-colors">
            <h3 className="font-semibold text-lg line-clamp-1" title={property.title}>{property.title}</h3>
          </Link>
          <div className="text-right">
            <span className="font-bold text-lg text-primary-600">₹{(property.rent).toLocaleString('en-IN')}</span>
            <span className="text-xs text-muted-foreground block">/month</span>
          </div>
        </div>
        
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{property.locality}, {property.city}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/50 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 justify-center">
            <BedDouble className="w-4 h-4 text-foreground/70" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center border-l border-border/50">
            <Bath className="w-4 h-4 text-foreground/70" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center border-l border-border/50">
            <Square className="w-4 h-4 text-foreground/70" />
            <span>{property.areaSqFt} ft²</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
            {property.furnishing}
          </span>
          <Link href={`/properties/${property.id}`}>
            <Button size="sm" className="font-medium">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
