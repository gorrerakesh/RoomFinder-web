"use client";

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, BedDouble, Bath, Square, Calendar, ChevronLeft, ChevronRight, 
  Heart, Share2, Phone, Mail, MessageCircle, CalendarDays, CheckCircle2,
  Globe, Send, Link2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import propertiesData from '@/data/properties.json';
import amenitiesData from '@/data/amenities.json';

const allProperties = propertiesData;

// Define Lucide icons map for amenities
import * as LucideIcons from 'lucide-react';

export default function PropertyDetailsPage({ params }) {
  const { id } = React.use(params);
  const [property, setProperty] = useState(allProperties.find(p => p.id === id));
  const [isNotFound, setIsNotFound] = useState(false);

  React.useEffect(() => {
    let found = allProperties.find(p => p.id === id);
    if (!found) {
      try {
        const stored = localStorage.getItem('listedProperties');
        if (stored) {
          const localProps = JSON.parse(stored);
          found = localProps.find(p => p.id === id);
        }
      } catch (e) {}
    }
    
    if (found) {
      setProperty(found);
    } else {
      setIsNotFound(true);
    }
  }, [id]);

  const [activeImage, setActiveImage] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const saveEnquiry = (enq) => {
    try {
      const stored = JSON.parse(localStorage.getItem('propertyEnquiries') || '[]');
      stored.unshift(enq);
      localStorage.setItem('propertyEnquiries', JSON.stringify(stored));
    } catch (e) { console.error(e); }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const enquiry = {
      id: "ENQ" + Date.now(),
      type: "CONTACT",
      propertyId: property.id,
      propertyTitle: property.title,
      ownerEmail: property.ownerEmail || property.owner?.email || 'admin@roomfinder.com',
      customerName: formData.get("name"),
      customerPhone: formData.get("phone"),
      customerEmail: formData.get("email"),
      message: formData.get("message"),
      status: "New",
      timestamp: new Date().toISOString()
    };
    saveEnquiry(enquiry);
    setContactSuccess(true);
  };

  const handleVisitSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const enquiry = {
      id: "VISIT" + Date.now(),
      type: "VISIT",
      propertyId: property.id,
      propertyTitle: property.title,
      ownerEmail: property.ownerEmail || property.owner?.email || 'admin@roomfinder.com',
      customerName: formData.get("name"),
      customerPhone: formData.get("phone"),
      visitDate: formData.get("date"),
      visitTime: formData.get("time"),
      visitors: formData.get("visitors"),
      status: "New",
      timestamp: new Date().toISOString()
    };
    saveEnquiry(enquiry);
    setVisitSuccess(true);
  };

  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = property ? isFavorite(property.id) : false;

  const nextImage = () => {
    if (!property) return;
    const len = property.images?.length || 1;
    setActiveImage((prev) => (prev + 1) % len);
  };
  const prevImage = () => {
    if (!property) return;
    const len = property.images?.length || 1;
    setActiveImage((prev) => (prev - 1 + len) % len);
  };

  if (isNotFound) {
    notFound();
  }

  if (!property) {
    return <div className="min-h-screen flex items-center justify-center">Loading property details...</div>;
  }

  // Helper to render icon by name
  const renderIcon = (iconName) => {
    const Icon = LucideIcons[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />;
  };

  return (
    <div className="bg-muted/20 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-primary-600">Properties</Link>
          <span>/</span>
          <span className="text-foreground truncate">{property.title}</span>
        </div>

        {/* Gallery */}
        <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2 h-[400px] md:h-[500px]">
            {/* Main Image */}
            <div className="relative col-span-1 md:col-span-2 rounded-xl overflow-hidden group">
              <img 
                src={(property.images || [])[activeImage] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full text-black shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full text-black shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-md">
                {activeImage + 1} / {(property.images || []).length || 1}
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="hidden lg:grid grid-rows-2 gap-2 h-full">
              {(property.images || []).slice(1, 3).map((img, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden">
                  <img src={img} alt={`Property view ${idx+2}`} className="w-full h-full object-cover" />
                  {idx === 1 && (property.images || []).length > 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors">
                      <span className="text-white font-bold text-xl">+{ (property.images || []).length - 3} Photos</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{property.title}</h1>
                <div className="flex gap-2">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title="View on Google Maps"
                    className="p-2.5 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground hover:text-green-600 transition-colors shadow-sm flex items-center justify-center"
                  >
                    <MapPin className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => toggleFavorite(property.id)}
                    className={cn(
                      "p-2.5 rounded-full border shadow-sm transition-colors flex items-center justify-center",
                      favorited ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100" : "border-border bg-background hover:bg-muted text-muted-foreground hover:text-red-500"
                    )}
                  >
                    <Heart className="w-5 h-5" fill={favorited ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="p-2.5 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground hover:text-primary-600 transition-colors shadow-sm flex items-center justify-center"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground mb-6 hover:text-primary-600 transition-colors group/map"
              >
                <MapPin className="w-5 h-5 mr-1.5 text-primary-600 group-hover/map:animate-bounce" />
                <span className="text-lg underline underline-offset-4 decoration-primary-500/30 group-hover/map:decoration-primary-600">{property.address}</span>
              </a>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-border">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm flex items-center gap-1.5"><BedDouble className="w-4 h-4"/> Bedrooms</span>
                  <span className="font-semibold text-lg">{property.bedrooms} Beds</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm flex items-center gap-1.5"><Bath className="w-4 h-4"/> Bathrooms</span>
                  <span className="font-semibold text-lg">{property.bathrooms} Baths</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm flex items-center gap-1.5"><Square className="w-4 h-4"/> Area</span>
                  <span className="font-semibold text-lg">{property.areaSqFt} sq.ft</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Available From</span>
                  <span className="font-semibold text-lg">{new Date(property.availableFrom).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <div className="prose max-w-none text-muted-foreground mb-8">
                <p>{property.description}</p>
              </div>
              
              <h2 className="text-xl font-bold mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg border border-border/50">
                  <span className="text-muted-foreground font-medium">Complete Address</span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-semibold hover:text-primary-600 hover:underline transition-colors"
                  >
                    {property.address}
                  </a>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg border border-border/50">
                  <span className="text-muted-foreground font-medium">Location (Area/City)</span>
                  <span className="text-foreground font-semibold">
                    {property.locality}, {property.city}
                    {property.pincode ? ` - ${property.pincode}` : ''}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg border border-border/50">
                  <span className="text-muted-foreground font-medium">Carpet Area</span>
                  <span className="text-foreground font-semibold">{property.areaSqFt} sq.ft</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg border border-border/50">
                  <span className="text-muted-foreground font-medium">Property Type</span>
                  <span className="text-foreground font-semibold">{property.propertyType}</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {(property.amenities || []).map(amenityId => {
                  const amenity = amenitiesData.find(a => a.id === amenityId);
                  if (!amenity) return null;
                  return (
                    <div key={amenity.id} className="flex items-center gap-3 text-muted-foreground">
                      <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                        {renderIcon(amenity.icon)}
                      </div>
                      <span className="font-medium text-foreground">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar / Sticky Action Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl p-6 border border-border shadow-xl">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-3xl font-extrabold text-primary-600">₹{(property.rent || 0).toLocaleString('en-IN')}</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
              </div>
              
              <div className="space-y-4 py-4 border-y border-border mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Security Deposit</span>
                  <span className="font-semibold text-foreground">₹{(property.deposit || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="font-semibold text-foreground">{property.propertyType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Furnishing</span>
                  <span className="font-semibold text-foreground">{property.furnishing}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tenant Pref.</span>
                  <span className="font-semibold text-foreground">{(property.tenantPreference || ['Any']).join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center font-bold text-xl uppercase">
                  {(property.owner?.name || 'O').charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{property.owner?.name || 'Property Owner'}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    {property.owner?.verified && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                    {property.owner?.verified ? 'Verified Owner' : 'Owner'}
                  </p>
                  <div className="flex flex-col gap-1 text-sm text-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{property.owner?.mobile || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{property.owner?.contact || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full font-bold shadow-lg shadow-primary-500/20" size="lg" onClick={() => setIsContactModalOpen(true)}>
                  Contact Owner
                </Button>
                <Button variant="outline" className="w-full font-bold" size="lg" onClick={() => setIsVisitModalOpen(true)}>
                  Schedule Visit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isContactModalOpen} onClose={() => { setIsContactModalOpen(false); setContactSuccess(false); }} title="Contact Owner">
        {contactSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
            <p className="text-muted-foreground mb-6">The owner has received your message and will contact you shortly.</p>
            <Button onClick={() => setIsContactModalOpen(false)}>Done</Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleContactSubmit}>
            <p className="text-sm text-muted-foreground mb-4">You are contacting <strong>{property.owner?.name || 'the Owner'}</strong> regarding <strong>{property.title}</strong>.</p>
            <Input name="name" placeholder="Your Name" required />
            <Input name="phone" type="tel" placeholder="Your Mobile Number" required />
            <Input name="email" type="email" placeholder="Your Email Address" required />
            <textarea 
              name="message"
              className="w-full h-24 rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              placeholder="Hi, I am interested in this property. Is it still available?"
              required
            />
            <Button type="submit" className="w-full">Send Message</Button>
            
            <div className="flex items-center gap-2 pt-2">
              <div className="flex-1 border-t border-border"></div>
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 border-t border-border"></div>
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 gap-2" onClick={() => window.open(`tel:${property.owner?.mobile || ''}`)}>
                <Phone className="w-4 h-4" /> 
                <span>{property.owner?.mobile || 'Contact Owner'}</span>
              </Button>
              <Button className="flex-1 gap-2 text-white bg-green-600 hover:bg-green-700" onClick={() => window.open(`https://wa.me/${(property.owner?.contact || '').replace(/[^0-9]/g, '')}`, '_blank')}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.571-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                <span>WhatsApp</span>
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={isVisitModalOpen} onClose={() => { setIsVisitModalOpen(false); setVisitSuccess(false); }} title="Schedule a Visit">
        {visitSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold mb-2">Visit Scheduled!</h4>
            <p className="text-muted-foreground mb-6">Your visit request has been submitted. The owner will confirm shortly.</p>
            <Button onClick={() => setIsVisitModalOpen(false)}>Done</Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleVisitSubmit}>
            <p className="text-sm text-muted-foreground mb-4">Schedule a time to visit <strong>{property.title}</strong>.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1 block">Date</label>
                <Input name="date" type="date" required />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block">Time</label>
                <Input name="time" type="time" required />
              </div>
            </div>
            <Input name="name" placeholder="Your Name" required />
            <Input name="phone" type="tel" placeholder="Your Mobile Number" required />
            <div>
                <label className="text-xs font-semibold mb-1 block">Number of People</label>
                <select name="visitors" className="w-full h-11 rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </select>
            </div>
            <Button type="submit" className="w-full mt-2">Confirm Visit</Button>
          </form>
        )}
      </Modal>

      {/* Share Modal */}
      <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title="Share this Property">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">Share <strong>{property.title}</strong> with friends and family.</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full gap-2 text-green-600 border-green-200 hover:bg-green-50" onClick={() => window.open(`https://wa.me/?text=Check out this property: ${property.title} - ${window.location.href}`, '_blank')}>
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </Button>
            <Button variant="outline" className="w-full gap-2 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}>
              <Globe className="w-4 h-4" /> Facebook
            </Button>
            <Button variant="outline" className="w-full gap-2 text-sky-500 border-sky-200 hover:bg-sky-50" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this property: ${property.title}`, '_blank')}>
              <Send className="w-4 h-4" /> Twitter
            </Button>
            <Button variant="outline" className="w-full gap-2" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!'); }}>
              <Link2 className="w-4 h-4" /> Copy Link
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
