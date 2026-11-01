const express = require('express');
const path = require('path');
const applicationsRouter = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static assets (CSS, icons, scripts)
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (from HTML form submissions) and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Application routes
app.use('/', applicationsRouter);

// 404 handler for unrecognized routes
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>404 - Page Not Found</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body style="display:flex; justify-content:center; align-items:center; min-height:100vh; text-align:center;">
      <div class="card" style="max-width: 500px; padding: 40px;">
        <h1 style="color: var(--primary); font-size: 3rem; margin-bottom: 10px;">404</h1>
        <h2>Page Not Found</h2>
        <p style="color: var(--text-muted); margin: 15px 0 25px;">The page you are looking for does not exist.</p>
        <a href="/" class="btn btn-primary">Return to Home</a>
      </div>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Job Application Portal is running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`⚡ Server-side validation active`);
  console.log(`===============================================`);
});
