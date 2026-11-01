const express = require('express');
const router = express.Router();
const { validateApplication, POSITIONS } = require('../middleware/validation');

// In-memory data store for submitted job applications
const applications = [
  {
    id: 'app-1001',
    fullName: 'Sophia Martinez',
    email: 'sophia.martinez@example.com',
    phone: '9876543210',
    position: 'Full Stack Engineer',
    experience: 4,
    coverLetter: 'I have 4 years of experience building modern web applications with Node.js, Express, and React. I am passionate about scalable backends and clean server-side architecture.',
    submittedAt: new Date(Date.now() - 3600000 * 2).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }
];

/**
 * GET /
 * Display the job application form
 */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Job Application Portal',
    positions: POSITIONS,
    errors: {},
    formData: {},
    totalApplications: applications.length
  });
});

/**
 * POST /apply
 * Validate and process the job application form submission
 */
router.post('/apply', validateApplication, (req, res) => {
  // If server-side validation failed, re-render form with errors and preserved data
  if (req.hasErrors) {
    return res.status(400).render('index', {
      title: 'Job Application Portal',
      positions: req.validPositions,
      errors: req.validationErrors,
      formData: req.body, // Preserves user-entered data
      totalApplications: applications.length
    });
  }

  // If server-side validation succeeded, create new application record
  const newApplication = {
    id: 'app-' + Date.now().toString().slice(-6),
    fullName: req.body.fullName.trim(),
    email: req.body.email.trim(),
    phone: req.body.phone.trim(),
    position: req.body.position.trim(),
    experience: Number(req.body.experience),
    coverLetter: req.body.coverLetter.trim(),
    submittedAt: new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  };

  // Store the application
  applications.unshift(newApplication);

  // Render the success confirmation page
  res.render('success', {
    title: 'Application Submitted Successfully',
    application: newApplication,
    totalApplications: applications.length
  });
});

/**
 * GET /applications
 * Display all submitted applications
 */
router.get('/applications', (req, res) => {
  res.render('applications', {
    title: 'Submitted Applications',
    applications: applications,
    totalApplications: applications.length
  });
});

/**
 * POST /applications/:id/delete
 * Delete an application by its ID
 */
router.post('/applications/:id/delete', (req, res) => {
  const { id } = req.params;
  const index = applications.findIndex(app => app.id === id);

  if (index !== -1) {
    applications.splice(index, 1);
  }

  res.redirect('/applications');
});

module.exports = router;
