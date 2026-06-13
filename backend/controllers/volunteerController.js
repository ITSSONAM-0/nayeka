import Volunteer from '../models/Volunteer.js';

// @desc    Get all volunteers (paginated, searched, filtered)
// @route   GET /api/volunteers
// @access  Private/Admin
export const getVolunteers = async (req, res) => {
  try {
    const { search, status, availability, page = 1, limit = 10, exportCsv } = req.query;

    const queryObj = { role: 'volunteer' };

    // Apply status filter
    if (status && status !== 'all') {
      queryObj.status = status;
    }

    // Apply availability filter
    if (availability && availability !== 'all') {
      queryObj.availability = availability;
    }

    // Apply search filter (name, email, city, skills)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      queryObj.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { city: searchRegex },
        { skills: searchRegex }
      ];
    }

    // If client requested CSV export, return all matched records without pagination
    if (exportCsv === 'true') {
      const volunteers = await Volunteer.find(queryObj).sort({ registrationDate: -1 });
      return res.status(200).json({ success: true, data: volunteers });
    }

    // Standard pagination setup
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Volunteer.countDocuments(queryObj);
    const volunteers = await Volunteer.find(queryObj)
      .sort({ registrationDate: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: volunteers.length,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      data: volunteers
    });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get volunteer by ID
// @route   GET /api/volunteers/:id
// @access  Private
export const getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).select('-password');

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }

    // Check authorization: must be admin OR the logged-in volunteer themselves
    if (req.user.role !== 'admin' && req.user._id.toString() !== volunteer._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this profile' });
    }

    res.status(200).json({ success: true, data: volunteer });
  } catch (error) {
    console.error('Error fetching volunteer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new volunteer (Admin dashboard or manual insert)
// @route   POST /api/volunteers
// @access  Private/Admin
export const createVolunteer = async (req, res) => {
  try {
    const { fullName, email, password, phone, city, skills, availability, status, participationHistory } = req.body;

    // Check if email already exists
    const volunteerExists = await Volunteer.findOne({ email });
    if (volunteerExists) {
      return res.status(400).json({ success: false, message: 'A volunteer with this email already exists' });
    }

    // Create volunteer
    const volunteer = await Volunteer.create({
      fullName,
      email,
      password: password || 'welcome123', // Default temporary password
      phone,
      city,
      skills: skills || [],
      availability: availability || 'Flexible',
      status: status || 'active',
      role: 'volunteer',
      participationHistory: participationHistory || []
    });

    const responseData = volunteer.toObject();
    delete responseData.password;

    res.status(201).json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error creating volunteer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update volunteer details
// @route   PUT /api/volunteers/:id
// @access  Private
export const updateVolunteer = async (req, res) => {
  try {
    let volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }

    // Check authorization: must be admin OR the logged-in volunteer themselves
    const isOwner = req.user._id.toString() === volunteer._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    // Set fields that can be updated
    const { fullName, phone, city, skills, availability, password } = req.body;

    if (fullName) volunteer.fullName = fullName;
    if (phone) volunteer.phone = phone;
    if (city) volunteer.city = city;
    if (skills) volunteer.skills = skills;
    if (availability) volunteer.availability = availability;
    
    // Optional password update
    if (password && password.trim() !== '') {
      volunteer.password = password;
    }

    // Admin-only updates
    if (isAdmin) {
      const { status, role, participationHistory } = req.body;
      if (status) volunteer.status = status;
      if (role) volunteer.role = role;
      if (participationHistory) volunteer.participationHistory = participationHistory;
    }

    await volunteer.save();

    const responseData = volunteer.toObject();
    delete responseData.password;

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error updating volunteer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete volunteer profile
// @route   DELETE /api/volunteers/:id
// @access  Private/Admin
export const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }

    // Do not allow deleting admins via this endpoint
    if (volunteer.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete an administrator account' });
    }

    await Volunteer.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Volunteer deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard metrics and statistics
// @route   GET /api/volunteers/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalVolunteers = await Volunteer.countDocuments({ role: 'volunteer' });
    const activeVolunteers = await Volunteer.countDocuments({ role: 'volunteer', status: 'active' });

    // New registrations within last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newRegistrations = await Volunteer.countDocuments({
      role: 'volunteer',
      registrationDate: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        totalVolunteers,
        activeVolunteers,
        newRegistrations
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
