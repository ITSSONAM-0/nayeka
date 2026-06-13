import React, { useState, useEffect } from 'react';
import { apiCall } from '../context/AuthContext';
import { toast } from './Toast';
import { X, Check, Plus, Trash2, Calendar, Sparkles } from 'lucide-react';

const EditVolunteerModal = ({ volunteer, isOpen, onClose, onSave }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [availability, setAvailability] = useState('Flexible');
  const [status, setStatus] = useState('active');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  
  // History items state
  const [participationHistory, setParticipationHistory] = useState([]);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (volunteer) {
      setFullName(volunteer.fullName || '');
      setPhone(volunteer.phone || '');
      setCity(volunteer.city || '');
      setAvailability(volunteer.availability || 'Flexible');
      setStatus(volunteer.status || 'active');
      setSkills(volunteer.skills || []);
      setParticipationHistory(volunteer.participationHistory || []);
    }
  }, [volunteer, isOpen]);

  if (!isOpen || !volunteer) return null;

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

  // History Operations
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventName.trim() || !newEventDesc.trim()) {
      toast.error('Event Name and Description are required to log participation');
      return;
    }
    const newEvent = {
      eventName: newEventName.trim(),
      description: newEventDesc.trim(),
      date: new Date(newEventDate)
    };
    setParticipationHistory([...participationHistory, newEvent]);
    setNewEventName('');
    setNewEventDesc('');
    toast.success('Campaign activity logged! Click Save to apply.');
  };

  const handleRemoveEvent = (indexToRemove) => {
    setParticipationHistory(participationHistory.filter((_, idx) => idx !== indexToRemove));
    toast.info('Event removed. Click Save to apply.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !city.trim()) {
      toast.error('Please fill in Name, Phone and City');
      return;
    }

    setIsSaving(true);
    try {
      const response = await apiCall(`/api/volunteers/${volunteer._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          fullName,
          phone,
          city,
          availability,
          status,
          skills,
          participationHistory
        })
      });

      if (response.success) {
        toast.success('Volunteer details updated!');
        onSave();
        onClose();
      } else {
        throw new Error(response.message || 'Failed to update details');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-8 animate-slide-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Edit Volunteer Profile</h3>
            <p className="text-xs text-slate-500">Managing account of: {volunteer.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-350 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-slate-900"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-350 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-slate-900"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-350 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-slate-900"
                required
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3 py-2 border border-slate-350 bg-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-slate-900"
              >
                <option value="Flexible">Flexible</option>
                <option value="Weekends">Weekends</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Full-time">Full-time</option>
              </select>
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Active Status</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                    className="accent-primary-600 w-4 h-4"
                  />
                  <span className="text-slate-800">Active</span>
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={status === 'inactive'}
                    onChange={() => setStatus('inactive')}
                    className="accent-rose-600 w-4 h-4"
                  />
                  <span className="text-slate-800">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="border-t border-slate-150 pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Volunteering Skills</label>
            <div className="flex flex-wrap gap-1.5 mb-2 max-h-24 overflow-y-auto p-1.5 border border-slate-100 rounded-xl bg-slate-50">
              {skills.length === 0 ? (
                <span className="text-xs text-slate-400">No skill badges associated</span>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 bg-white text-slate-700 border border-slate-200 text-xs px-2.5 py-0.5 rounded-full font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill tag"
                className="flex-1 px-3 py-1.5 border border-slate-350 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 rounded-xl text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Participation History Editor */}
          <div className="border-t border-slate-150 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" /> Logging & Participation History
            </h4>

            {/* List existing history */}
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
              {participationHistory.length === 0 ? (
                <div className="text-center py-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 text-xs italic">
                  No campaigns logged for this volunteer.
                </div>
              ) : (
                participationHistory.map((event, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                  >
                    <div>
                      <span className="block font-bold text-slate-800">{event.eventName}</span>
                      <span className="block text-slate-500 mt-0.5">{event.description}</span>
                      <span className="block text-[10px] text-slate-400 font-medium mt-1">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add New History Form Panel */}
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3">
              <span className="block text-xs font-bold text-slate-700">Add Campaign/Activity Log</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  placeholder="Campaign/Event Name (e.g. Slum Drive)"
                  className="px-3 py-1.5 border border-slate-350 bg-white rounded-xl text-xs focus:outline-none text-slate-900"
                />
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="px-3 py-1.5 border border-slate-350 bg-white rounded-xl text-xs focus:outline-none text-slate-900"
                />
              </div>

              <textarea
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                placeholder="Brief description of the volunteer's tasks..."
                rows={2}
                className="w-full px-3 py-1.5 border border-slate-350 bg-white rounded-xl text-xs focus:outline-none text-slate-900"
              />

              <button
                type="button"
                onClick={handleAddEvent}
                className="w-full py-1.5 bg-primary-50 border border-primary-200 hover:bg-primary-100 rounded-xl text-xs font-bold text-primary-700 cursor-pointer flex items-center justify-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" /> Log Event to History
              </button>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2 border border-transparent rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-md flex items-center gap-1 cursor-pointer disabled:opacity-75"
          >
            <Check className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVolunteerModal;
