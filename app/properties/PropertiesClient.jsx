"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, Map, List, X, Search } from 'lucide-react';
import propertiesData from '@/data/properties.json';
import locationsData from '@/data/locations.json';
import amenitiesData from '@/data/amenities.json';

export function PropertiesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [view, setView] = useState('list');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [localProperties, setLocalProperties] = useState([]);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('listedProperties');
      if (stored) {
        setLocalProperties(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);
  
  const allProperties = useMemo(() => {
    return [...localProperties, ...propertiesData];
  }, [localProperties]);

  // Parse initial state from URL or use defaults
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    locality: searchParams.get('locality') || '',
    type: searchParams.get('type') || '',
    tenant: searchParams.get('tenant') || '',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    furnishing: searchParams.get('furnishing') || '',
    sort: searchParams.get('sort') || 'relevance',
  });

  const [selectedAmenities, setSelectedAmenities] = useState(
    searchParams.get('amenities')?.split(',').filter(Boolean) || []
  );

  // Update URL when filters change
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.locality) params.set('locality', filters.locality);
    if (filters.type) params.set('type', filters.type);
    if (filters.tenant) params.set('tenant', filters.tenant);
    if (filters.minRent) params.set('minRent', filters.minRent);
    if (filters.maxRent) params.set('maxRent', filters.maxRent);
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
    if (filters.furnishing) params.set('furnishing', filters.furnishing);
    if (filters.sort && filters.sort !== 'relevance') params.set('sort', filters.sort);
    if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));
    
    router.push(`${pathname}?${params.toString()}`);
    setShowMobileFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      city: '', locality: '', type: '', tenant: '',
      minRent: '', maxRent: '', bedrooms: '', furnishing: '', sort: 'relevance'
    });
    setSelectedAmenities([]);
    router.push(pathname);
  };

  // Filter logic
  const filteredProperties = useMemo(() => {
    let result = allProperties.filter(p => {
      if (filters.city && p.city !== filters.city) return false;
      if (filters.locality && p.locality?.toLowerCase().indexOf(filters.locality.toLowerCase()) === -1) return false;
      if (filters.type && p.propertyType !== filters.type) return false;
      if (filters.tenant) {
        const prefs = p.tenantPreference || ['Any'];
        if (!prefs.includes(filters.tenant) && !prefs.includes('Any')) return false;
      }
      if (filters.minRent && p.rent < parseInt(filters.minRent)) return false;
      if (filters.maxRent && p.rent > parseInt(filters.maxRent)) return false;
      if (filters.bedrooms && p.bedrooms !== parseInt(filters.bedrooms) && !(filters.bedrooms === '4+' && p.bedrooms >= 4)) return false;
      if (filters.furnishing && p.furnishing !== filters.furnishing) return false;
      
      // Amenities check
      if (selectedAmenities.length > 0) {
        const pAmenities = p.amenities || [];
        const hasAllAmenities = selectedAmenities.every(a => pAmenities.includes(a));
        if (!hasAllAmenities) return false;
      }
      return true;
    });

    // Sort logic
    if (filters.sort === 'price_asc') {
      result.sort((a, b) => a.rent - b.rent);
    } else if (filters.sort === 'price_desc') {
      result.sort((a, b) => b.rent - a.rent);
    } else if (filters.sort === 'newest') {
      result.sort((a, b) => new Date(b.availableFrom).getTime() - new Date(a.availableFrom).getTime());
    }
    
    return result;
  }, [filters, selectedAmenities]);

  // Derived options
  const selectedCityData = locationsData.find(loc => loc.city === filters.city);
  const localities = selectedCityData ? selectedCityData.localities : [];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <Button onClick={() => setShowMobileFilters(true)} variant="outline" className="flex-1 mr-2">
          <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
        </Button>
        <div className="flex bg-muted rounded-md p-1 border border-border">
          <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'bg-background shadow' : ''}`}><List className="w-4 h-4"/></button>
          <button onClick={() => setView('map')} className={`p-2 rounded ${view === 'map' ? 'bg-background shadow' : ''}`}><Map className="w-4 h-4"/></button>
        </div>
      </div>

      {/* Filter Sidebar */}
      <aside className={`
        fixed inset-0 z-50 bg-background md:bg-transparent md:static md:w-72 flex-shrink-0 flex flex-col 
        transition-transform duration-300 md:translate-x-0 overflow-y-auto
        ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 md:p-0 md:bg-card md:border md:border-border md:rounded-xl md:shadow-sm">
          <div className="flex justify-between items-center mb-6 md:p-5 md:border-b md:border-border/50">
            <h2 className="text-xl font-bold flex items-center">
              <SlidersHorizontal className="w-5 h-5 mr-2" /> Filters
            </h2>
            <button onClick={() => setShowMobileFilters(false)} className="md:hidden p-2 rounded-full hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
            <button onClick={clearFilters} className="hidden md:block text-sm text-primary-600 hover:underline">
              Clear All
            </button>
          </div>

          <div className="space-y-6 md:p-5">
            <div>
              <label className="text-sm font-semibold mb-2 block">Location</label>
              <Select 
                value={filters.city} 
                onChange={(e) => setFilters({...filters, city: e.target.value, locality: ''})}
                options={[
                  { label: "Any City", value: "" },
                  ...locationsData.map(loc => ({ label: loc.city, value: loc.city }))
                ]} 
                className="mb-3"
              />
              <Select 
                value={filters.locality} 
                onChange={(e) => setFilters({...filters, locality: e.target.value})}
                options={[
                  { label: "Any Locality", value: "" },
                  ...localities.map(loc => ({ label: loc, value: loc }))
                ]} 
                disabled={!filters.city}
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Property Type</label>
              <Select 
                value={filters.type} 
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                options={[
                  { label: "Any Type", value: "" },
                  { label: "1 BHK", value: "1 BHK" },
                  { label: "2 BHK", value: "2 BHK" },
                  { label: "3 BHK", value: "3 BHK" },
                  { label: "Apartment", value: "Apartment" },
                  { label: "Villa", value: "Villa" },
                  { label: "PG", value: "PG" },
                  { label: "Single Room", value: "Single Room" },
                  { label: "Shared Room", value: "Shared Room" },
                ]} 
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Tenant Preference</label>
              <Select 
                value={filters.tenant} 
                onChange={(e) => setFilters({...filters, tenant: e.target.value})}
                options={[
                  { label: "Any", value: "" },
                  { label: "Family", value: "Family" },
                  { label: "Bachelor", value: "Bachelor" },
                  { label: "Student", value: "Student" },
                  { label: "Working Professional", value: "Working Professional" },
                  { label: "Couple", value: "Couple" },
                ]} 
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Budget (₹ / month)</label>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="Min" 
                  value={filters.minRent} 
                  onChange={(e) => setFilters({...filters, minRent: e.target.value})}
                />
                <Input 
                  type="number" 
                  placeholder="Max" 
                  value={filters.maxRent} 
                  onChange={(e) => setFilters({...filters, maxRent: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Bedrooms</label>
              <div className="flex flex-wrap gap-2">
                {['1', '2', '3', '4+'].map(bed => (
                  <button 
                    key={bed}
                    onClick={() => setFilters({...filters, bedrooms: filters.bedrooms === bed ? '' : bed})}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                      filters.bedrooms === bed 
                        ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium' 
                        : 'bg-background border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    {bed} BHK
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Furnishing</label>
              <div className="flex flex-col gap-2">
                {['Fully Furnished', 'Semi Furnished', 'Unfurnished'].map(furnishing => (
                  <label key={furnishing} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input 
                      type="radio" 
                      name="furnishing" 
                      className="text-primary-600 focus:ring-primary-500 rounded-full"
                      checked={filters.furnishing === furnishing}
                      onChange={() => setFilters({...filters, furnishing})}
                    />
                    {furnishing}
                  </label>
                ))}
                {filters.furnishing && (
                  <button 
                    onClick={() => setFilters({...filters, furnishing: ''})}
                    className="text-xs text-muted-foreground text-left mt-1 hover:text-foreground"
                  >
                    Clear selection
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Amenities</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {amenitiesData.map(amenity => (
                  <label key={amenity.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-border text-primary-600 focus:ring-primary-500"
                      checked={selectedAmenities.includes(amenity.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAmenities([...selectedAmenities, amenity.id]);
                        } else {
                          setSelectedAmenities(selectedAmenities.filter(a => a !== amenity.id));
                        }
                      }}
                    />
                    {amenity.name}
                  </label>
                ))}
              </div>
            </div>
            
            <Button className="w-full" onClick={applyFilters}>
              Apply Filters
            </Button>
            
            <Button variant="outline" className="w-full md:hidden" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        </div>
      </aside>

      {/* Results Section */}
      <main className="flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {filteredProperties.length} Properties Found
            </h2>
            <p className="text-muted-foreground text-sm">
              {filters.city ? `In ${filters.locality ? filters.locality + ', ' : ''}${filters.city}` : 'Across all cities'}
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Select 
              value={filters.sort}
              onChange={(e) => {
                const newFilters = {...filters, sort: e.target.value};
                setFilters(newFilters);
                // Immediately apply sort for better UX
                const params = new URLSearchParams(searchParams.toString());
                params.set('sort', e.target.value);
                router.push(`${pathname}?${params.toString()}`);
              }}
              options={[
                { label: "Relevance", value: "relevance" },
                { label: "Price: Low to High", value: "price_asc" },
                { label: "Price: High to Low", value: "price_desc" },
                { label: "Newest First", value: "newest" },
              ]}
              className="w-full sm:w-48"
            />
            
            <div className="hidden md:flex bg-card rounded-md p-1 border border-border shadow-sm">
              <button 
                onClick={() => setView('list')} 
                className={`p-2 rounded ${view === 'list' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
                title="List View"
              >
                <List className="w-4 h-4"/>
              </button>
              <button 
                onClick={() => setView('map')} 
                className={`p-2 rounded ${view === 'map' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
                title="Map View"
              >
                <Map className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>

        {filteredProperties.length > 0 ? (
          view === 'list' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl flex items-center justify-center min-h-[500px] flex-1">
              <div className="text-center">
                <Map className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-foreground mb-2">Map View</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Map integration would display the {filteredProperties.length} properties here. 
                  (Google Maps / Mapbox API key required for actual map rendering).
                </p>
                <Button className="mt-6" onClick={() => setView('list')}>
                  Switch to List View
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 bg-card border border-border rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No properties found</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              We couldn't find any properties matching your exact criteria. Try adjusting your filters or searching in a different location.
            </p>
            <Button onClick={clearFilters} size="lg">
              Clear All Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
