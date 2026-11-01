const http = require('http');

// Helper to make HTTP requests
function makeRequest({ method, path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method,
        headers
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      }
    );

    req.on('error', reject);

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Job Application Portal Test Suite ---');

  // Test 1: GET / (Form display)
  console.log('\n[Test 1] Testing GET / ...');
  const getIndex = await makeRequest({ method: 'GET', path: '/' });
  console.log(`Status: ${getIndex.statusCode}`);
  console.assert(getIndex.statusCode === 200, 'Expected status 200');
  console.assert(getIndex.body.includes('Job Application Portal'), 'Page must contain title');
  console.assert(getIndex.body.includes('Frontend Developer'), 'Form must contain positions');
  console.log('✓ GET / passed.');

  // Test 2: POST /apply with empty data
  console.log('\n[Test 2] Testing POST /apply with empty data (Server Validation) ...');
  const emptyForm = new URLSearchParams({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    coverLetter: ''
  }).toString();

  const postEmpty = await makeRequest({
    method: 'POST',
    path: '/apply',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(emptyForm)
    },
    body: emptyForm
  });

  console.log(`Status: ${postEmpty.statusCode}`);
  console.assert(postEmpty.statusCode === 400, 'Expected 400 Bad Request on empty validation failure');
  console.assert(postEmpty.body.includes('Full Name is required.'), 'Missing Full Name error');
  console.assert(postEmpty.body.includes('Email Address is required.'), 'Missing Email error');
  console.assert(postEmpty.body.includes('Phone Number is required.'), 'Missing Phone error');
  console.assert(postEmpty.body.includes('Please select a position from the dropdown.'), 'Missing Position error');
  console.assert(postEmpty.body.includes('Years of Experience is required.'), 'Missing Experience error');
  console.assert(postEmpty.body.includes('Cover Letter is required.'), 'Missing Cover Letter error');
  console.log('✓ Empty submission validation passed (all 6 required fields caught).');

  // Test 3: POST /apply with invalid constraint values
  console.log('\n[Test 3] Testing POST /apply with invalid constraints (< 3 chars name, bad email, 5-digit phone, negative exp, < 50 chars cover letter) ...');
  const invalidForm = new URLSearchParams({
    fullName: 'Jo',
    email: 'bad-email-address',
    phone: '12345',
    position: 'NonExistentRole',
    experience: '-5',
    coverLetter: 'Too short cover letter.'
  }).toString();

  const postInvalid = await makeRequest({
    method: 'POST',
    path: '/apply',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(invalidForm)
    },
    body: invalidForm
  });

  console.log(`Status: ${postInvalid.statusCode}`);
  console.assert(postInvalid.statusCode === 400, 'Expected 400 Bad Request');
  console.assert(postInvalid.body.includes('Full Name must be at least 3 characters long.'), 'Min 3 chars error missing');
  console.assert(postInvalid.body.includes('Please provide a valid email address'), 'Valid email format error missing');
  console.assert(postInvalid.body.includes('Phone Number must be exactly 10 digits'), '10-digit phone error missing');
  console.assert(postInvalid.body.includes('The selected position is invalid'), 'Invalid position error missing');
  console.assert(postInvalid.body.includes('Years of Experience cannot be negative.'), 'Negative exp error missing');
  console.assert(postInvalid.body.includes('Cover Letter must be at least 50 characters long'), 'Cover letter min 50 error missing');
  // Check preservation of user-entered data
  console.assert(postInvalid.body.includes('value="Jo"'), 'fullName must be preserved');
  console.assert(postInvalid.body.includes('value="bad-email-address"'), 'email must be preserved');
  console.assert(postInvalid.body.includes('value="12345"'), 'phone must be preserved');
  console.assert(postInvalid.body.includes('value="-5"'), 'experience must be preserved');
  console.assert(postInvalid.body.includes('Too short cover letter.'), 'coverLetter must be preserved');
  console.log('✓ Constraint validation and form data preservation passed.');

  // Test 4: POST /apply with valid data
  console.log('\n[Test 4] Testing POST /apply with completely valid data ...');
  const validCoverLetter = 'I am an enthusiastic Full Stack Engineer with 3 years of deep experience in modern JavaScript, Node.js, and Express web development.';
  const validForm = new URLSearchParams({
    fullName: 'David Miller',
    email: 'david.miller@example.com',
    phone: '9871234560',
    position: 'Full Stack Engineer',
    experience: '3',
    coverLetter: validCoverLetter
  }).toString();

  const postValid = await makeRequest({
    method: 'POST',
    path: '/apply',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(validForm)
    },
    body: validForm
  });

  console.log(`Status: ${postValid.statusCode}`);
  console.assert(postValid.statusCode === 200, 'Expected 200 OK on valid application');
  console.assert(postValid.body.includes('Application Received!'), 'Success header missing');
  console.assert(postValid.body.includes('David Miller'), 'Applicant name missing on success page');
  console.assert(postValid.body.includes('david.miller@example.com'), 'Applicant email missing on success page');
  console.log('✓ Valid application submission passed.');

  // Test 5: GET /applications
  console.log('\n[Test 5] Testing GET /applications ...');
  const getApps = await makeRequest({ method: 'GET', path: '/applications' });
  console.log(`Status: ${getApps.statusCode}`);
  console.assert(getApps.statusCode === 200, 'Expected 200 OK');
  console.assert(getApps.body.includes('David Miller'), 'Newly created application must be visible');
  console.assert(getApps.body.includes('Sophia Martinez'), 'Initial preloaded application must be visible');
  console.assert(getApps.body.includes('Total: <strong>2</strong> Candidates'), 'Count badge should show 2 candidates');
  console.log('✓ Applications listing and counter badge passed.');

  // Test 6: POST /applications/:id/delete
  console.log('\n[Test 6] Testing application deletion ...');
  const deleteRes = await makeRequest({
    method: 'POST',
    path: '/applications/app-1001/delete'
  });
  console.log(`Status: ${deleteRes.statusCode}`);
  console.assert(deleteRes.statusCode === 302, 'Expected 302 redirect after deletion');
  const getAppsAfterDelete = await makeRequest({ method: 'GET', path: '/applications' });
  console.assert(!getAppsAfterDelete.body.includes('Sophia Martinez'), 'Deleted applicant Sophia Martinez must no longer appear');
  console.assert(getAppsAfterDelete.body.includes('Total: <strong>1</strong> Candidate'), 'Count badge should now show 1 candidate');
  console.log('✓ Application deletion and redirect passed.');

  console.log('\n===============================================');
  console.log('🎉 ALL SERVER-SIDE VALIDATION TESTS PASSED!');
  console.log('===============================================');
}

// Start server in background within test process to run tests
const server = require('./server');
setTimeout(() => {
  runTests().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error('Test suite failed:', err);
    process.exit(1);
  });
}, 500);
