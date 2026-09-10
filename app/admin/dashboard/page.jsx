"use client";

import React, { useState, useEffect } from 'react';
import { Users, Building, CheckCircle, Clock, AlertTriangle, Key, Shield, UserCog, HeartHandshake, Edit, Trash2, Eye, MapPin, BedDouble, Bath, Square, Calendar } from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import mockProperties from '@/data/properties.json';

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState([]);
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'all', 'pending', 'approved', 'rented'
  const [editingProperty, setEditingProperty] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = () => {
    const storedProps = JSON.parse(localStorage.getItem('listedProperties') || '[]');
    const deletedMockIds = JSON.parse(localStorage.getItem('deletedMockIds') || '[]');
    const editedMockProps = JSON.parse(localStorage.getItem('editedMockProps') || '{}');

    const availableMocks = mockProperties
      .filter(p => !deletedMockIds.includes(p.id))
      .map(p => editedMockProps[p.id] ? { ...p, ...editedMockProps[p.id] } : p);

    setProperties([...storedProps, ...availableMocks]);
  };

  const handleUpdateProperty = (updatedProperty) => {
    if (updatedProperty.id.startsWith('PROP0')) {
      const edited = JSON.parse(localStorage.getItem('editedMockProps') || '{}');
      edited[updatedProperty.id] = updatedProperty;
      localStorage.setItem('editedMockProps', JSON.stringify(edited));
    } else {
      const storedProps = JSON.parse(localStorage.getItem('listedProperties') || '[]');
      const updatedProps = storedProps.map(p => p.id === updatedProperty.id ? updatedProperty : p);
      localStorage.setItem('listedProperties', JSON.stringify(updatedProps));
    }
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
    setEditingProperty(null);
  };

  const handleDeleteProperty = (id) => {
    if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      if (id.startsWith('PROP0')) {
        const deleted = JSON.parse(localStorage.getItem('deletedMockIds') || '[]');
        localStorage.setItem('deletedMockIds', JSON.stringify([...deleted, id]));
      } else {
        const storedProps = JSON.parse(localStorage.getItem('listedProperties') || '[]');
        const updatedProps = storedProps.filter(p => p.id !== id);
        localStorage.setItem('listedProperties', JSON.stringify(updatedProps));
      }
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const p = properties.find(prop => prop.id === id);
    if (p) {
      handleUpdateProperty({ ...p, status: newStatus });
    }
  };

  const getUploadDate = (id) => {
    if (id.startsWith('PROP0')) {
      const num = parseInt(id.replace('PROP0', '')) || 1;
      return new Date(2024, 4, (num % 28) + 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    const timestamp = parseInt(id.replace('PROP', ''));
    if (!isNaN(timestamp) && timestamp > 1000000000000) {
      return new Date(timestamp).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    return "Recently Uploaded";
  };

  const pendingProps = properties.filter(p => p.status === 'Pending');
  const rentedProps = properties.filter(p => p.status === 'Rented');
  const rejectedProps = properties.filter(p => p.status === 'Rejected');
  
  // Calculate Inactive: explicitly 'Inactive', or 'Active' but older than 30 days
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  const inactiveProps = properties.filter(p => {
    if (p.status === 'Inactive') return true;
    if (p.status === 'Active') {
      const timestamp = p.id.startsWith('PROP0') 
        ? new Date(2024, 4, (parseInt(p.id.replace('PROP0', '')) % 28) + 1).getTime()
        : parseInt(p.id.replace('PROP', ''));
        
      if (!isNaN(timestamp) && (now - timestamp > THIRTY_DAYS_MS)) {
        return true;
      }
    }
    return false;
  });

  // Approved properties are Active ones that aren't Inactive
  const approvedProps = properties.filter(p => p.status === 'Active' && !inactiveProps.includes(p));

  let displayProperties = [];
  if (activeView === 'all') displayProperties = properties;
  else if (activeView === 'pending') displayProperties = pendingProps;
  else if (activeView === 'approved') displayProperties = approvedProps;
  else if (activeView === 'rented') displayProperties = rentedProps;
  else if (activeView === 'inactive') displayProperties = inactiveProps;

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, properties, and system settings.</p>
          </div>
          {activeView !== 'overview' && (
            <Button variant="outline" onClick={() => setActiveView('overview')}>
              Back to Overview
            </Button>
          )}
        </div>
        
        <h2 className="text-xl font-bold mb-4">Property Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard 
            icon={<Building />} title="Total Properties" value={properties.length} color="blue" 
            onClick={() => setActiveView('all')} isActive={activeView === 'all'}
          />
          <MetricCard 
            icon={<Clock />} title="Pending Approvals" value={pendingProps.length} color="orange" 
            onClick={() => setActiveView('pending')} isActive={activeView === 'pending'}
          />
          <MetricCard 
            icon={<CheckCircle />} title="Active Properties" value={approvedProps.length} color="green" 
            onClick={() => setActiveView('approved')} isActive={activeView === 'approved'}
          />
          <MetricCard 
            icon={<AlertTriangle />} title="Inactive Properties" value={inactiveProps.length} color="slate" 
            onClick={() => setActiveView('inactive')} isActive={activeView === 'inactive'}
          />
          <MetricCard 
            icon={<Key />} title="Rented Properties" value={rentedProps.length} color="emerald" 
            onClick={() => setActiveView('rented')} isActive={activeView === 'rented'}
          />
        </div>

        {activeView === 'overview' ? (
          <>
            <h2 className="text-xl font-bold mb-4 mt-8">User Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 opacity-75">
              <MetricCard icon={<Users />} title="Total Users" value="12,543" color="blue" />
              <MetricCard icon={<UserCog />} title="Total Owners" value="3,210" color="purple" />
              <MetricCard icon={<HeartHandshake />} title="Total Customers" value="9,333" color="indigo" />
              <MetricCard icon={<Shield />} title="Admin Roles" value="5" color="slate" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold">Recent Pending Approvals</h2>
                  <button onClick={() => setActiveView('pending')} className="text-sm text-primary-600 hover:underline font-medium">View all</button>
                </div>
                <div className="space-y-4">
                  {pendingProps.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{p.title}</h4>
                        <p className="text-xs text-muted-foreground">Owner: {p.ownerEmail || 'System Data'}</p>
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                        <button onClick={() => handleStatusChange(p.id, 'Active')} className="px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold rounded-md transition-colors">Approve</button>
                        <button onClick={() => handleStatusChange(p.id, 'Rejected')} className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold rounded-md transition-colors">Reject</button>
                      </div>
                    </div>
                  ))}
                  {pendingProps.length === 0 && <p className="text-sm text-muted-foreground">No pending approvals.</p>}
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold">Recent User Reports</h2>
                  <button className="text-sm text-primary-600 hover:underline font-medium">View all</button>
                </div>
                <div className="space-y-4">
                  <ReportItem issue="Fake Property Listing" target="PROP10239" status="Pending" />
                  <ReportItem issue="Unresponsive Owner" target="OWNER4421" status="Investigating" />
                  <ReportItem issue="Inappropriate Image" target="PROP9921" status="Resolved" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 capitalize">{activeView} Properties</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-t-lg">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Property Details</th>
                    <th className="px-6 py-3">Owner / Uploaded</th>
                    <th className="px-6 py-3">Rent</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 rounded-tr-lg text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayProperties.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                        No properties found in this category.
                      </td>
                    </tr>
                  ) : (
                    displayProperties.map(p => (
                      <tr key={p.id} className="bg-card border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                              <img src={p.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"} alt="prop" className="w-full h-full object-cover"/>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground line-clamp-1">{p.title}</p>
                              <p className="text-xs text-muted-foreground font-mono mt-1">{p.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-foreground">{p.ownerEmail || 'System Database'}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" /> {getUploadDate(p.id)}
                          </p>
                        </td>
                        <td className="px-6 py-4">₹{p.rent}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            inactiveProps.includes(p) ? 'bg-slate-100 text-slate-700' :
                            p.status === 'Active' ? 'bg-green-100 text-green-700' :
                            p.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                            p.status === 'Rented' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {inactiveProps.includes(p) ? 'Inactive' : p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {p.status === 'Pending' && (
                              <button onClick={() => handleStatusChange(p.id, 'Active')} className="text-green-600 hover:bg-green-50 p-1.5 rounded-md" title="Approve">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => setViewingProperty(p)} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-md" title="View Full Details">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingProperty(p)} className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-md" title="Edit Property">
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
        )}
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
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {viewingProperty.locality}, {viewingProperty.city}</span>
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
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700">
                  {inactiveProps.includes(viewingProperty) ? 'Inactive' : viewingProperty.status}
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
                {viewingProperty.amenities?.map((amenity, idx) => (
                  <span key={idx} className="bg-muted px-3 py-1 rounded-full text-sm text-foreground border border-border">
                    {amenity}
                  </span>
                ))}
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
        <Modal isOpen={!!editingProperty} onClose={() => setEditingProperty(null)} title="Edit Property Details">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleUpdateProperty({
              ...editingProperty,
              title: formData.get('title'),
              rent: parseInt(formData.get('rent'), 10),
              status: formData.get('status')
            });
          }} className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1 block">Property Title</label>
              <Input name="title" defaultValue={editingProperty.title} required />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Monthly Rent (₹)</label>
              <Input name="rent" type="number" defaultValue={editingProperty.rent} required />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Status</label>
              <Select name="status" defaultValue={inactiveProps.includes(editingProperty) ? 'Inactive' : editingProperty.status} options={[
                { label: 'Active', value: 'Active' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Rented', value: 'Rented' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Rejected', value: 'Rejected' },
              ]} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => setEditingProperty(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </RoleGuard>
  );
}

function MetricCard({ icon, title, value, color, onClick, isActive }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-500 group-hover:bg-blue-500 group-hover:text-white",
    purple: "bg-purple-100 text-purple-500",
    indigo: "bg-indigo-100 text-indigo-500",
    green: "bg-green-100 text-green-500 group-hover:bg-green-500 group-hover:text-white",
    emerald: "bg-emerald-100 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white",
    orange: "bg-orange-100 text-orange-500 group-hover:bg-orange-500 group-hover:text-white",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-500",
    teal: "bg-teal-100 text-teal-500",
    slate: "bg-slate-100 text-slate-500",
  };

  const isClickable = !!onClick;

  return (
    <div 
      onClick={onClick}
      className={`bg-card border p-5 rounded-xl flex items-center gap-4 transition-all ${
        isClickable ? 'cursor-pointer hover:shadow-md hover:border-primary-300 group' : 'shadow-sm border-border'
      } ${isActive ? 'ring-2 ring-primary-500 border-transparent shadow-md' : 'border-border'}`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${colorMap[color] || colorMap.blue}`}>
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <div>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{title}</p>
      </div>
    </div>
  );
}

function ReportItem({ issue, target, status }) {
  const getStatusColor = (s) => {
    if (s === 'Pending') return 'bg-orange-100 text-orange-700';
    if (s === 'Investigating') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
      <div>
        <h4 className="font-semibold text-sm">{issue}</h4>
        <p className="text-xs text-muted-foreground">Target: {target}</p>
      </div>
      <span className={`px-2 py-1 text-xs font-semibold rounded-md ${getStatusColor(status)}`}>
        {status}
      </span>
    </div>
  );
}
