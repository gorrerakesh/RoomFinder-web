"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import amenitiesData from '@/data/amenities.json';
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function AddPropertyPage() {
  const router = useRouter();
  const [success, setSuccess] = React.useState(false);
  const [images, setImages] = React.useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const propertyType = formData.get("propertyType") || "";
    const city = formData.get("city") || "";
    let bedrooms = 0;
    if (propertyType.includes("1 BHK")) bedrooms = 1;
    else if (propertyType.includes("2 BHK")) bedrooms = 2;
    else if (propertyType.includes("3 BHK")) bedrooms = 3;
    else if (propertyType.includes("Villa") || propertyType.includes("Independent House")) bedrooms = 4;

    const newProperty = {
      id: "PROP" + Date.now(),
      title: formData.get("title"),
      propertyType: propertyType,
      rent: parseInt(formData.get("rent")) || 0,
      deposit: parseInt(formData.get("deposit")) || 0,
      city: city,
      locality: formData.get("locality"),
      address: formData.get("address"),
      pincode: formData.get("pincode"),
      furnishing: formData.get("furnishing"),
      bedrooms: bedrooms,
      tenantPreference: ["Any"],
      amenities: formData.getAll("amenities"),
      status: "Active",
      views: 0,
      enquiries: 0,
      ownerEmail: JSON.parse(localStorage.getItem('user') || '{}').email || 'unknown',
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]
    };
    
    const existing = JSON.parse(localStorage.getItem('listedProperties') || '[]');
    const propertiesToSave = [newProperty, ...existing];
    
    try {
      localStorage.setItem('listedProperties', JSON.stringify(propertiesToSave));
    } catch (e) {
      // If Base64 images are too large, fallback to placeholders to avoid QuotaExceededError
      if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
        const fallbackProperty = {
          ...newProperty,
          images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]
        };
        localStorage.setItem('listedProperties', JSON.stringify([fallbackProperty, ...existing]));
        alert("The uploaded images were too large to store in local memory. Using a default property image instead so your listing can still be saved.");
      } else {
        console.error(e);
      }
    }

    setSuccess({ city, type: propertyType });
  };

  if (success) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Property Listed Successfully!</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Your property has been successfully listed on RoomFinder. It is now visible to thousands of potential tenants.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push('/owner/dashboard')}>Go to Dashboard</Button>
          <Button onClick={() => router.push(`/properties?city=${encodeURIComponent(success.city)}&type=${encodeURIComponent(success.type)}`)}>
            View Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['OWNER']}>
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">List a New Property</h1>
          <p className="text-muted-foreground">Fill in the details below to publish your property on RoomFinder.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-1.5 block">Property Title</label>
                <Input name="title" placeholder="e.g. Spacious 2 BHK in Madhapur" required />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Property Type</label>
                <Select name="propertyType" options={[
                  { label: "Select Type", value: "" },
                  { label: "1 BHK", value: "1 BHK" },
                  { label: "2 BHK", value: "2 BHK" },
                  { label: "3 BHK", value: "3 BHK" },
                  { label: "Apartment", value: "Apartment" },
                  { label: "Villa", value: "Villa" },
                  { label: "Independent House", value: "Independent House" },
                  { label: "PG / Hostel", value: "PG" },
                ]} required />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Furnishing</label>
                <Select name="furnishing" options={[
                  { label: "Select Furnishing", value: "" },
                  { label: "Fully Furnished", value: "Fully Furnished" },
                  { label: "Semi Furnished", value: "Semi Furnished" },
                  { label: "Unfurnished", value: "Unfurnished" },
                ]} required />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Monthly Rent (₹)</label>
                <Input name="rent" type="number" placeholder="20000" required />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Security Deposit (₹)</label>
                <Input name="deposit" type="number" placeholder="40000" required />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-1.5 block">Property Description</label>
                <textarea 
                  className="w-full h-32 rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  placeholder="Describe your property, nearby landmarks, etc."
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">City</label>
                <Select name="city" options={[
                  { label: "Select City", value: "" },
                  { label: "Hyderabad", value: "Hyderabad" },
                  { label: "Bengaluru", value: "Bengaluru" },
                  { label: "Mumbai", value: "Mumbai" },
                  { label: "Pune", value: "Pune" },
                  { label: "Delhi", value: "Delhi" },
                  { label: "Chennai", value: "Chennai" },
                ]} required />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Locality / Area</label>
                <Input name="locality" placeholder="e.g. Madhapur" required />
              </div>
              <div className="md:col-span-1">
                <label className="text-sm font-semibold mb-1.5 block">Complete Address</label>
                <Input name="address" placeholder="House No, Street, Landmark" required />
              </div>
              <div className="md:col-span-1">
                <label className="text-sm font-semibold mb-1.5 block">Pincode</label>
                <Input name="pincode" placeholder="e.g. 500081" required pattern="[0-9]*" title="Enter a valid pincode" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amenitiesData.map(amenity => (
                <label key={amenity.id} className="flex items-center gap-2 text-sm cursor-pointer p-2 border border-border rounded-lg hover:bg-muted transition-colors">
                  <input 
                    type="checkbox" 
                    name="amenities"
                    value={amenity.id}
                    className="rounded border-border text-primary-600 focus:ring-primary-500"
                  />
                  {amenity.name}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Photos</h2>
            <div 
              className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center relative"
              onClick={() => document.getElementById('propertyImages').click()}
            >
              <input 
                type="file" 
                id="propertyImages" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="font-semibold mb-1">Click to upload multiple images</p>
              <p className="text-sm text-muted-foreground mb-4">SVG, PNG, JPG or GIF (max. 5MB)</p>
              <Button type="button" variant="outline">Browse Files</Button>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {images.map((img, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-border">
                    <img src={img} className="w-full h-32 object-cover" alt="Property preview" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" className="text-white text-xs font-semibold bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md" onClick={(e) => { e.stopPropagation(); setImages(images.filter((_, idx) => idx !== i)); }}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" size="lg">List Property</Button>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
}
