import React, { useState } from 'react';
import { useAuth, apiCall } from '../context/AuthContext';
import { toast } from './Toast';
import { Calendar, User, Phone, MapPin, Sparkles, Activity, Check, Edit2, X, Plus } from 'lucide-react';

const VolunteerDashboard = () => {
  const { user, updateProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [availability, setAvailability] = useState(user?.availability || 'Flexible');
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !city.trim()) {
      toast.error('Name, Phone and City are required fields');
      return;
    }

    setIsSaving(true);
    try {
      const response = await apiCall(`/api/volunteers/${user._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          fullName,
          phone,
          city,
          availability,
          skills
        })
      });

      if (response.success && response.data) {
        updateProfile(response.data);
        setIsEditing(false);
        toast.success('Your profile has been updated successfully!');
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.fullName || '');
    setPhone(user?.phone || '');
    setCity(user?.city || '');
    setAvailability(user?.availability || 'Flexible');
    setSkills(user?.skills || []);
    setIsEditing(false);
  };

  // Compute registration age
  const regDate = user?.registrationDate ? new Date(user.registrationDate) : new Date();
  const daysActive = Math.max(1, Math.ceil((new Date() - regDate) / (1000 * 60 * 60 * 24)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-primary-900/10 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-20 -translate-y-20 blur-xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4.5xl font-extrabold tracking-tight mb-2">
              Hello, {user?.fullName}!
            </h1>
            <p className="text-primary-100 text-sm sm:text-base max-w-xl">
              Thank you for contributing your time and energy to NayePankh Foundation. Together, we are creating wings of opportunity.
            </p>
          </div>
          <div className="flex gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 select-none">
            <div className="text-center">
              <span className="block text-xl sm:text-2xl font-black">{user?.participationHistory?.length || 0}</span>
              <span className="text-[10px] font-semibold text-primary-200 uppercase tracking-wider">Events Attended</span>
            </div>
            <div className="w-[1px] bg-white/20 self-stretch"></div>
            <div className="text-center">
              <span className="block text-xl sm:text-2xl font-black">{daysActive}</span>
              <span className="text-[10px] font-semibold text-primary-200 uppercase tracking-wider">Days Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              <span>Volunteer Profile</span>
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">City / Town</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Availability Status</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-slate-900"
                >
                  <option value="Flexible">Flexible</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Full-time">Full-time</option>
                </select>
              </div>

              {/* Skills Editor */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Skills Badge Setup</label>
                <div className="flex flex-wrap gap-1.5 mb-2 max-h-24 overflow-y-auto p-1 border border-slate-100 rounded-lg bg-slate-50">
                  {skills.length === 0 ? (
                    <span className="text-xs text-slate-400 p-1">No skills added yet</span>
                  ) : (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 bg-white text-slate-700 border border-slate-200 text-xs px-2 py-0.5 rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-500 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill tag"
                    className="flex-1 min-w-0 px-2.5 py-1 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="p-1.5 bg-slate-150 border border-slate-200 hover:bg-slate-200 rounded-xl text-slate-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Save & Cancel */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2 px-3 border border-transparent rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-sm flex items-center justify-center gap-1 cursor-pointer disabled:opacity-75"
                >
                  <Check className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-2 px-3 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Profile Details List */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email</span>
                    <span className="text-sm text-slate-800 font-medium break-all">{user?.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Phone</span>
                    <span className="text-sm text-slate-800 font-medium">{user?.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Location City</span>
                    <span className="text-sm text-slate-800 font-medium">{user?.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Availability</span>
                    <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      user?.availability === 'Full-time'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {user?.availability}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="border-t border-slate-100 pt-4">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Volunteering Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {user?.skills?.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No skills listed</span>
                  ) : (
                    user?.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="bg-primary-50 text-primary-700 border border-primary-100 text-xs px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Participation History Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-md p-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary-600" />
            <span>My Participation History</span>
          </h2>

          {!user?.participationHistory || user.participationHistory.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No participation records yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Your volunteering actions and NGO campaign attendances will appear here. Attend cleanups, distribution drives, or teaching events!
              </p>
            </div>
          ) : (
            <div className="flow-root">
              <ul className="-mb-8">
                {user.participationHistory.map((event, idx) => {
                  const isLast = idx === user.participationHistory.length - 1;
                  return (
                    <li key={event._id || idx}>
                      <div className="relative pb-8">
                        {!isLast && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center ring-8 ring-white shrink-0">
                              <Sparkles className="h-4 w-4 text-emerald-600 fill-emerald-100" />
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm font-bold text-slate-800">
                                {event.eventName}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                {event.description}
                              </p>
                            </div>
                            <div className="text-right text-xs whitespace-nowrap text-slate-500 shrink-0 font-medium">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
