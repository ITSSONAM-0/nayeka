import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, User, Mail, Lock, Phone, MapPin, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from '../components/Toast';

const PRESET_SKILLS = [
  'Teaching',
  'Mentoring',
  'Content Writing',
  'Social Media',
  'Graphic Design',
  'Event Planning',
  'Logistics',
  'Fundraising',
  'First Aid',
  'Photography'
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [availability, setAvailability] = useState('Flexible');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (!customSkill.trim()) return;
    if (!selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
    }
    setCustomSkill('');
  };

  const validate = () => {
    const tempErrors = {};

    if (!fullName.trim()) tempErrors.fullName = 'Full name is required';
    
    if (!email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please provide a valid email';
    }

    if (!phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.replace(/[\s\-\+\(\)]/g, ''))) {
      // Basic 10-digit number validation after stripping common formatting characters
      tempErrors.phone = 'Please provide a valid 10-digit phone number';
    }

    if (!city.trim()) tempErrors.city = 'City location is required';

    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the registration form');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = {
        fullName,
        email,
        phone,
        city,
        password,
        availability,
        skills: selectedSkills
      };
      
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // errors logged in toast within auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse delay-700"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
            <Heart className="w-8 h-8 fill-white" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          NayePankh Foundation
        </h2>
        <p className="mt-1.5 text-center text-sm text-slate-600">
          Spread your wings. Join us as a volunteer.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl z-10">
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 rounded-2xl sm:px-10">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Create Volunteer Account</h3>
          
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                    }}
                    className={`block w-full pl-9 pr-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all ${
                      errors.fullName ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    className={`block w-full pl-9 pr-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all ${
                      errors.email ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    className={`block w-full pl-9 pr-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all ${
                      errors.phone ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                    }`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.phone}</p>}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">City / Location</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
                    }}
                    className={`block w-full pl-9 pr-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all ${
                      errors.city ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                    }`}
                    placeholder="Delhi / Mumbai"
                  />
                </div>
                {errors.city && <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.city}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className={`block w-full pl-9 pr-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all ${
                      errors.password ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                    }`}
                    placeholder="••••••"
                  />
                </div>
                {errors.password && <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    className={`block w-full pl-9 pr-3 py-2 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all ${
                      errors.confirmPassword ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                    }`}
                    placeholder="••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">Availability Status</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
              >
                <option value="Flexible">Flexible / Anytime</option>
                <option value="Weekends">Weekends Only</option>
                <option value="Weekdays">Weekdays Only</option>
                <option value="Full-time">Full-time Commitment</option>
              </select>
            </div>

            {/* Skills Badges Choice */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Your Skills (Optional)</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 fill-white text-primary-500" />}
                      {skill}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Skill input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  className="block w-full px-3 py-1.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-xs transition-all"
                  placeholder="Custom skill (e.g. Finance, Counseling)"
                />
                <button
                  onClick={handleAddCustomSkill}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer shrink-0"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-850 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-md shadow-primary-700/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4" /> Register Profile
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-all">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
