import React, { useState, useEffect } from 'react';
import { apiCall } from '../context/AuthContext';
import { toast } from './Toast';
import EditVolunteerModal from './EditVolunteerModal';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  Users,
  UserCheck,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const AdminDashboard = () => {
  // Stats
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    activeVolunteers: 0,
    newRegistrations: 0
  });

  // Table Data & Pagination
  const [volunteers, setVolunteers] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });

  // Search/Filter Params
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [availability, setAvailability] = useState('all');

  // Interactive triggers
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Load stats
  const fetchStats = async () => {
    try {
      const response = await apiCall('/api/volunteers/stats');
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  // Load volunteers
  const fetchVolunteers = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        status,
        availability,
        search
      });

      const response = await apiCall(`/api/volunteers?${queryParams.toString()}`);
      if (response.success && response.data) {
        setVolunteers(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Error loading volunteers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchVolunteers();
  }, [page, status, availability]);

  // Handle Search Trigger (debounced or triggered on enter/click)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVolunteers();
  };

  // Trigger re-fetch when search input is completely cleared
  useEffect(() => {
    if (search === '') {
      setPage(1);
      fetchVolunteers();
    }
  }, [search]);

  // Delete Action
  const handleDelete = async (id) => {
    try {
      const response = await apiCall(`/api/volunteers/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        toast.success('Volunteer deleted successfully');
        setDeleteTarget(null);
        fetchStats();
        fetchVolunteers();
      } else {
        throw new Error(response.message || 'Failed to delete volunteer');
      }
    } catch (err) {
      toast.error(err.message);
      setDeleteTarget(null);
    }
  };

  // CSV Export Action
  const exportToCSV = async () => {
    try {
      const queryParams = new URLSearchParams({
        exportCsv: 'true',
        status,
        availability,
        search
      });

      const response = await apiCall(`/api/volunteers?${queryParams.toString()}`);
      if (!response.success || !response.data || response.data.length === 0) {
        toast.info('No volunteer records matching current criteria to export');
        return;
      }

      const headers = ['Full Name', 'Email', 'Phone', 'City', 'Skills', 'Availability', 'Status', 'Registration Date'];
      
      const csvRows = [headers.join(',')];

      response.data.forEach((vol) => {
        const skillsString = vol.skills ? vol.skills.join(' | ') : '';
        const regDateStr = new Date(vol.registrationDate).toLocaleDateString('en-US');
        
        // Escape quotes
        const row = [
          `"${vol.fullName.replace(/"/g, '""')}"`,
          `"${vol.email.replace(/"/g, '""')}"`,
          `"${vol.phone.replace(/"/g, '""')}"`,
          `"${vol.city.replace(/"/g, '""')}"`,
          `"${skillsString.replace(/"/g, '""')}"`,
          `"${vol.availability}"`,
          `"${vol.status}"`,
          `"${regDateStr}"`
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `volunteers_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Volunteer database CSV downloaded!');
    } catch (err) {
      toast.error('Error generating CSV: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3.5xl font-extrabold text-slate-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, manage, search, and edit volunteer profiles for NayePankh Foundation.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Total Volunteers Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Total Volunteers</span>
            <span className="text-3xl font-black text-slate-900 mt-2 block">{stats.totalVolunteers}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Volunteers Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Active Volunteers</span>
            <span className="text-3xl font-black text-slate-900 mt-2 block">{stats.activeVolunteers}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* New Registrations Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">New (Last 30 Days)</span>
            <span className="text-3xl font-black text-slate-900 mt-2 block">{stats.newRegistrations}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-6">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Text Search Input */}
            <div className="md:col-span-2 relative">
              <input
                type="text"
                placeholder="Search by name, email, city, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-900 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Status Dropdown */}
            <div>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-900"
              >
                <option value="all">Status: All Statuses</option>
                <option value="active">Status: Active</option>
                <option value="inactive">Status: Inactive</option>
              </select>
            </div>

            {/* Availability Dropdown */}
            <div>
              <select
                value={availability}
                onChange={(e) => {
                  setAvailability(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-900"
              >
                <option value="all">Availability: All</option>
                <option value="Flexible">Availability: Flexible</option>
                <option value="Weekends">Availability: Weekends</option>
                <option value="Weekdays">Availability: Weekdays</option>
                <option value="Full-time">Availability: Full-time</option>
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400">
              Matched: {pagination.total} volunteer records
            </span>
            <div className="flex gap-2.5">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-250 transition-colors"
              >
                <Filter className="w-3.5 h-3.5" /> Apply Filter
              </button>
              <button
                type="button"
                onClick={exportToCSV}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-750 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-slate-400 mt-2 animate-pulse">Loading directory data...</p>
            </div>
          ) : volunteers.length === 0 ? (
            <div className="py-20 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No volunteers match your search</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Try clearing search text or resetting the availability filters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wide">
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4">Skills Badges</th>
                  <th className="px-6 py-4">Availability</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {volunteers.map((vol) => (
                  <tr key={vol._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{vol.fullName}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-700">{vol.email}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{vol.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">{vol.city}</td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {vol.skills && vol.skills.length > 0 ? (
                          vol.skills.slice(0, 3).map((sk) => (
                            <span key={sk} className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                              {sk}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">None</span>
                        )}
                        {vol.skills && vol.skills.length > 3 && (
                          <span className="text-[9px] text-slate-400 px-1 font-semibold">
                            +{vol.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 font-bold uppercase rounded bg-slate-100 text-slate-600 text-[9px] tracking-wide">
                        {vol.availability}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        vol.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {vol.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedVolunteer(vol);
                          setIsEditOpen(true);
                        }}
                        className="p-1 text-slate-500 hover:text-slate-850 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                        title="Edit profile details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(vol)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 cursor-pointer"
                        title="Delete volunteer account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        {!isLoading && volunteers.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              Showing Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="p-1.5 border border-slate-250 bg-white hover:bg-slate-50 rounded-lg text-slate-600 disabled:opacity-50 disabled:hover:bg-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.pages}
                className="p-1.5 border border-slate-250 bg-white hover:bg-slate-50 rounded-lg text-slate-600 disabled:opacity-50 disabled:hover:bg-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-200 shadow-2xl p-6 animate-slide-in">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold">Confirm Account Deletion</h3>
            </div>
            
            <p className="text-slate-600 text-xs leading-relaxed mb-6">
              Are you sure you want to delete <span className="font-bold text-slate-800">{deleteTarget.fullName}</span>? 
              This action is permanent and cannot be undone. All volunteering logs and contact records will be wiped out.
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-slate-200 hover:border-slate-350 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget._id)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-750 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm shadow-rose-900/10"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Volunteer Modal */}
      <EditVolunteerModal
        volunteer={selectedVolunteer}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedVolunteer(null);
        }}
        onSave={() => {
          fetchStats();
          fetchVolunteers();
        }}
      />
    </div>
  );
};

export default AdminDashboard;
