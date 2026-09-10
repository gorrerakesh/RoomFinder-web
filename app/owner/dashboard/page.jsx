"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, Clock, CheckCircle, Key, FileText, Heart, Edit, Trash2, Eye, MapPin, BedDouble, Bath, Square, Calendar, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { RoleGuard } from '@/components/auth/RoleGuard';
import amenitiesData from '@/data/amenities.json';

export default function OwnerDashboardPage() {
  const [user, setUser] = useState(null);
  const [myProperties, setMyProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editImages, setEditImages] = useState([]);

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) {
        setUser(savedUser);
      }
      
      const storedProps = JSON.parse(localStorage.getItem('listedProperties') || '[]');
      const mine = storedProps.filter(p => p.ownerEmail === savedUser?.email);
      setMyProperties(mine);

      const storedEnquiries = JSON.parse(localStorage.getItem('propertyEnquiries') || '[]');
      const myEnquiries = storedEnquiries.filter(e => e.ownerEmail === savedUser?.email);
      setEnquiries(myEnquiries);
    } catch (e) {}
  }, []);

  const getUploadDate = (id) => {
    const timestamp = parseInt(id.replace('PROP', ''));
    if (!isNaN(timestamp) && timestamp > 1000000000000) {
      return new Date(timestamp).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    return "Recently Uploaded";
  };

  const handleUpdateProperty = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const propertyType = formData.get("propertyType") || editingProperty.propertyType;
    let bedrooms = editingProperty.bedrooms;
    if (propertyType.includes("1 BHK")) bedrooms = 1;
    else if (propertyType.includes("2 BHK")) bedrooms = 2;
    else if (propertyType.includes("3 BHK")) bedrooms = 3;
    else if (propertyType.includes("Villa") || propertyType.includes("Independent House")) bedrooms = 4;

    const updatedProperty = {
      ...editingProperty,
      title: formData.get("title"),
      propertyType: propertyType,
      rent: parseInt(formData.get("rent")) || editingProperty.rent,
      deposit: parseInt(formData.get("deposit")) || editingProperty.deposit,
      city: formData.get("city") || editingProperty.city,
      locality: formData.get("locality"),
      address: formData.get("address"),
      pincode: formData.get("pincode"),
      furnishing: formData.get("furnishing") || editingProperty.furnishing,
      bedrooms: bedrooms,
      amenities: formData.getAll("amenities"),
      images: editImages.length > 0 ? editImages : ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]
    };

    const storedProps = JSON.parse(localStorage.getItem('listedProperties') || '[]');
    const updatedProps = storedProps.map(p => p.id === updatedProperty.id ? updatedProperty : p);
    
    try {
      localStorage.setItem('listedProperties', JSON.stringify(updatedProps));
      setMyProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
      setEditingProperty(null);
    } catch (err) {
      if (err.name === 'QuotaExceededError' || err.message.includes('quota')) {
        alert("The uploaded images were too large to store in local memory. Try using fewer or smaller images.");
      }
    }
  };

  const handleDeleteProperty = (id) => {
    if (confirm('Are you sure you want to delete this property?')) {
      const storedProps = JSON.parse(localStorage.getItem('listedProperties') || '[]');
      const updatedProps = storedProps.filter(prop => prop.id !== id);
      localStorage.setItem('listedProperties', JSON.stringify(updatedProps));
      setMyProperties(prev => prev.filter(prop => prop.id !== id));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditImages(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const openEditModal = (p) => {
    setEditingProperty(p);
    setEditImages(p.images || []);
  };

  const handleResolveEnquiry = (id) => {
    const stored = JSON.parse(localStorage.getItem('propertyEnquiries') || '[]');
    const updated = stored.map(e => e.id === id ? { ...e, status: 'Resolved' } : e);
    localStorage.setItem('propertyEnquiries', JSON.stringify(updated));
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'Resolved' } : e));
  };

  const handleDeleteEnquiry = (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    const stored = JSON.parse(localStorage.getItem('propertyEnquiries') || '[]');
    const updated = stored.filter(e => e.id !== id);
    localStorage.setItem('propertyEnquiries', JSON.stringify(updated));
    setEnquiries(prev => prev.filter(e => e.id !== id));
  };

  const pendingCount = myProperties.filter(p => p.status === 'Pending').length;
  const approvedCount = myProperties.filter(p => p.status === 'Active').length;
  const rentedCount = myProperties.filter(p => p.status === 'Rented').length;

  const totalRequests = enquiries.length;
  const newRequests = enquiries.filter(e => e.status === 'New').length;

  return (
    <RoleGuard allowedRoles={['OWNER']}>
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Owner Dashboard</h1>
            <p className="text-muted-foreground">Manage your properties and tenant enquiries.</p>
          </div>
          <Link href="/owner/properties/add">
            <Button className="gap-2"><Building className="w-4 h-4"/> List New Property</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{myProperties.length}</h3>
              <p className="text-sm text-muted-foreground">My Properties</p>
            </div>
          </div>
          
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{pendingCount}</h3>
              <p className="text-sm text-muted-foreground">Pending Approval</p>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{approvedCount}</h3>
              <p className="text-sm text-muted-foreground">Approved Properties</p>
            </div>
          </div>
          
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{approvedCount}</h3>
              <p className="text-sm text-muted-foreground">Available Properties</p>
            </div>
          </div>
          
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{rentedCount}</h3>
              <p className="text-sm text-muted-foreground">Rented Properties</p>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{totalRequests}</h3>
              <p className="text-sm text-muted-foreground">Total Enquiries</p>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{newRequests}</h3>
              <p className="text-sm text-muted-foreground">New / Unread</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Your Properties</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-t-lg">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Property Details</th>
                  <th className="px-6 py-3">Rent</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Views</th>
                  <th className="px-6 py-3">Enquiries</th>
                  <th className="px-6 py-3 rounded-tr-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myProperties.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">
                      You haven't listed any properties yet.
                    </td>
                  </tr>
                ) : (
                  myProperties.map(p => (
                    <tr key={p.id} className="bg-card border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            <img src={p.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"} alt="prop" className="w-full h-full object-cover"/>
                          </div>
                          <div>
                            <p className="font-semibold line-clamp-1">{p.title}</p>
                            <p className="text-xs text-muted-foreground font-mono mt-1">{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">₹{p.rent}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          p.status === 'Active' ? 'bg-green-100 text-green-700' :
                          p.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                          p.status === 'Rented' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{p.views || 0}</td>
                      <td className="px-6 py-4"><span className="text-primary-600 font-bold">{p.enquiries || 0}</span></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setViewingProperty(p)} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-md" title="View Full Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEditModal(p)} className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-md" title="Edit Property">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProperty(p.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md" title="Delete Property">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Tenant Enquiries</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-t-lg">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Property</th>
                  <th className="px-6 py-3">Customer Details</th>
                  <th className="px-6 py-3">Request Info</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 rounded-tr-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">
                      No customer enquiries yet.
                    </td>
                  </tr>
                ) : (
                  enquiries.map(enq => (
                    <tr key={enq.id} className="bg-card border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        <Link href={`/properties/${enq.propertyId}`} className="text-primary-600 hover:underline">
                          {enq.propertyTitle}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">{enq.type === 'VISIT' ? 'Site Visit' : 'Message'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold">{enq.customerName}</p>
                        <p className="text-xs text-muted-foreground">{enq.customerPhone}</p>
                        {enq.customerEmail && <p className="text-xs text-muted-foreground">{enq.customerEmail}</p>}
                      </td>
                      <td className="px-6 py-4 max-w-[250px]">
                        {enq.type === 'VISIT' ? (
                          <div className="text-sm">
                            <span className="font-semibold text-primary-600">{enq.visitDate}</span> at {enq.visitTime}
                            <p className="text-xs text-muted-foreground mt-1">Visitors: {enq.visitors}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground truncate" title={enq.message}>{enq.message}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {new Date(enq.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${enq.status === 'New' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {enq.status === 'New' && (
                            <Button size="sm" variant="outline" onClick={() => handleResolveEnquiry(enq.id)}>
                              Mark Contacted
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2" onClick={() => handleDeleteEnquiry(enq.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Property Modal */}
      {viewingProperty && (
        <Modal isOpen={!!viewingProperty} onClose={() => setViewingProperty(null)} title="Property Details" className="max-w-2xl">
          <div className="space-y-6">
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
              {viewingProperty.images?.map((img, idx) => (
                <img key={idx} src={img} alt="Property" className="h-48 w-64 object-cover rounded-lg shrink-0 snap-start border border-border" />
              ))}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{viewingProperty.title}</h2>
              <div className="flex items-center text-muted-foreground mt-2 text-sm gap-4">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {viewingProperty.locality}, {viewingProperty.city} {viewingProperty.pincode && `- ${viewingProperty.pincode}`}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Uploaded: {getUploadDate(viewingProperty.id)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-xl border border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Monthly Rent</p>
                <p className="font-bold text-lg text-primary-600">₹{viewingProperty.rent}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Deposit</p>
                <p className="font-bold text-lg">₹{viewingProperty.deposit || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Property Type</p>
                <p className="font-bold">{viewingProperty.propertyType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  viewingProperty.status === 'Active' ? 'bg-green-100 text-green-700' :
                  viewingProperty.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                  viewingProperty.status === 'Rented' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {viewingProperty.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-y border-border py-4">
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{viewingProperty.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{viewingProperty.bathrooms || 2} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{viewingProperty.areaSqFt || '1200'} sq.ft</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {viewingProperty.amenities?.map((amenity, idx) => {
                  const amObj = amenitiesData.find(a => a.id === amenity);
                  return (
                    <span key={idx} className="bg-muted px-3 py-1 rounded-full text-sm text-foreground border border-border">
                      {amObj ? amObj.name : amenity}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setViewingProperty(null)}>Close Details</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <Modal isOpen={!!editingProperty} onClose={() => setEditingProperty(null)} title="Edit Property Details" className="max-w-4xl">
          <form onSubmit={handleUpdateProperty} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-1.5 block">Property Title</label>
                <Input name="title" defaultValue={editingProperty.title} required />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Property Type</label>
                <Select name="propertyType" defaultValue={editingProperty.propertyType} options={[
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
                <Select name="furnishing" defaultValue={editingProperty.furnishing} options={[
                  { label: "Fully Furnished", value: "Fully Furnished" },
                  { label: "Semi Furnished", value: "Semi Furnished" },
                  { label: "Unfurnished", value: "Unfurnished" },
                ]} required />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Monthly Rent (₹)</label>
                <Input name="rent" type="number" defaultValue={editingProperty.rent} required />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Security Deposit (₹)</label>
                <Input name="deposit" type="number" defaultValue={editingProperty.deposit} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">City</label>
                <Select name="city" defaultValue={editingProperty.city} options={[
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
                <Input name="locality" defaultValue={editingProperty.locality} required />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Complete Address</label>
                <Input name="address" defaultValue={editingProperty.address} required />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Pincode</label>
                <Input name="pincode" defaultValue={editingProperty.pincode} pattern="[0-9]*" title="Enter a valid pincode" />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <label className="text-sm font-semibold mb-3 block">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenitiesData.map(amenity => (
                  <label key={amenity.id} className="flex items-center gap-2 text-sm cursor-pointer p-2 border border-border rounded-lg hover:bg-muted transition-colors">
                    <input 
                      type="checkbox" 
                      name="amenities"
                      value={amenity.id}
                      defaultChecked={editingProperty.amenities?.includes(amenity.id)}
                      className="rounded border-border text-primary-600 focus:ring-primary-500"
                    />
                    {amenity.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <label className="text-sm font-semibold mb-3 block">Property Photos</label>
              <div 
                className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center mb-4"
                onClick={() => document.getElementById('editPropertyImages').click()}
              >
                <input 
                  type="file" 
                  id="editPropertyImages" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="font-semibold text-sm">Click to upload more images</p>
              </div>
              
              {editImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {editImages.map((img, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden border border-border h-24">
                      <img src={img} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" className="text-white text-xs font-semibold bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md" onClick={(e) => { e.stopPropagation(); setEditImages(editImages.filter((_, idx) => idx !== i)); }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setEditingProperty(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </RoleGuard>
  );
}
