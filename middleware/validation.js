/**
 * Validation Middleware for Job Application Portal
 * Implements strict server-side validation for all application form fields.
 */

// List of valid positions available for application
const POSITIONS = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Engineer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Data Analyst',
  'QA Automation Engineer'
];

/**
 * Middleware function to validate application submission
 */
const validateApplication = (req, res, next) => {
  const { fullName, email, phone, position, experience, coverLetter } = req.body;
  const errors = {};

  // 1. Full Name Validation: Required, minimum 3 characters
  if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
    errors.fullName = 'Full Name is required.';
  } else if (fullName.trim().length < 3) {
    errors.fullName = 'Full Name must be at least 3 characters long.';
  }

  // 2. Email Address Validation: Required and valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.email = 'Email Address is required.';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email address (e.g., alex@example.com).';
  }

  // 3. Phone Number Validation: Required, exactly 10 digits
  const phoneRegex = /^\d{10}$/;
  const cleanPhone = (phone || '').toString().trim();
  if (!cleanPhone) {
    errors.phone = 'Phone Number is required.';
  } else if (!phoneRegex.test(cleanPhone)) {
    errors.phone = 'Phone Number must be exactly 10 digits (numbers only, no spaces or dashes).';
  }

  // 4. Position Applied For Validation: Must be selected and in valid list
  if (!position || typeof position !== 'string' || position.trim() === '') {
    errors.position = 'Please select a position from the dropdown.';
  } else if (!POSITIONS.includes(position.trim())) {
    errors.position = 'The selected position is invalid. Please select from the list.';
  }

  // 5. Years of Experience Validation: Required and cannot be negative
  if (experience === undefined || experience === null || experience.toString().trim() === '') {
    errors.experience = 'Years of Experience is required.';
  } else {
    const expNum = Number(experience);
    if (isNaN(expNum)) {
      errors.experience = 'Years of Experience must be a valid number.';
    } else if (expNum < 0) {
      errors.experience = 'Years of Experience cannot be negative.';
    }
  }

  // 6. Cover Letter Validation: Required, minimum 50 characters
  if (!coverLetter || typeof coverLetter !== 'string' || coverLetter.trim() === '') {
    errors.coverLetter = 'Cover Letter is required.';
  } else if (coverLetter.trim().length < 50) {
    const currentLen = coverLetter.trim().length;
    errors.coverLetter = `Cover Letter must be at least 50 characters long (currently ${currentLen} characters).`;
  }

  // Attach validation results to req object
  req.validationErrors = errors;
  req.hasErrors = Object.keys(errors).length > 0;
  req.validPositions = POSITIONS;

  next();
};

module.exports = {
  validateApplication,
  POSITIONS
};
