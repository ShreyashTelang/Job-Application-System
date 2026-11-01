# 💼 Job Application Portal

A full-stack Node.js & Express web application demonstrating robust **server-side validation**, modular routing, EJS templating, and form state preservation.

---

## 📋 Features

- **Strict Server-Side Validation**: Validates all submitted data on the Node.js server using dedicated middleware before processing or storing.
- **Form State Preservation**: In case of validation errors, previously entered values are preserved so applicants do not have to retype everything.
- **Detailed Error Reporting**: Highlights invalid fields in red, shows clear inline error messages beneath each control, and displays an alert summary banner.
- **Live Character Counter**: Real-time counter for the Cover Letter (indicates progress toward the 50-character minimum).
- **Application Directory**: View all submitted applications with timestamps, candidate details, and count statistics.
- **Delete Application**: Allows removing any application with an interactive confirmation alert.
- **Responsive UI**: Polished, modern design styled with pure CSS, accessible forms, and mobile-friendly layout.

---

## 🏗️ Project Structure

```text
Job_Application/
│
├── server.js               # Express application entry point & server setup
├── package.json            # Project dependencies & scripts
├── test-validation.js      # Automated test suite for validation & routes
├── README.md               # Documentation & setup instructions
│
├── routes/
│   └── applications.js     # Route handlers for GET /, POST /apply, GET /applications, DELETE
│
├── middleware/
│   └── validation.js       # Server-side validation rules & middleware logic
│
├── views/
│   ├── index.ejs           # Job application form with error alerts & preserved inputs
│   ├── success.ejs         # Application submission confirmation page
│   └── applications.ejs    # List of all submitted job applications & delete action
│
└── public/
    └── style.css           # Modern styles, form states, and responsive layout
```

---

## 🛡️ Server-Side Validation Rules

| Input Field | Validation Criteria | Error Message Triggered |
| :--- | :--- | :--- |
| **Full Name** | Required, minimum 3 characters | `"Full Name is required."` or `"Full Name must be at least 3 characters long."` |
| **Email Address** | Required, standard valid email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) | `"Email Address is required."` or `"Please provide a valid email address (e.g., alex@example.com)."` |
| **Phone Number** | Required, exactly 10 digits (`/^\d{10}$/`) | `"Phone Number is required."` or `"Phone Number must be exactly 10 digits (numbers only, no spaces or dashes)."` |
| **Position** | Required, must be selected from approved list | `"Please select a position from the dropdown."` or `"The selected position is invalid."` |
| **Years of Experience** | Required, must be a non-negative number (`>= 0`) | `"Years of Experience is required."` or `"Years of Experience cannot be negative."` |
| **Cover Letter** | Required, minimum 50 characters | `"Cover Letter is required."` or `"Cover Letter must be at least 50 characters long (currently X characters)."` |

---

## 🔄 Application Flow

```text
               User fills the application form
                              ↓
                         POST /apply
                              ↓
              Node.js server receives data (req.body)
                              ↓
              Server-Side Validation Middleware
                         ↙          ↘
                      Invalid       Valid
                        ↓             ↓
               HTTP 400 Bad Request   Store application
               Display Errors &       Display Success Page
               Preserve Form Data     (views/success.ejs)
               (views/index.ejs)
```

---

## 🌐 Routes Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/` | Displays the job application form (with empty or preserved data and errors). |
| **POST** | `/apply` | Executes validation middleware. On error, renders `index.ejs` with 400 status; on success, saves data and renders `success.ejs`. |
| **GET** | `/applications` | Displays all successfully submitted applications with total count. |
| **POST** | `/applications/:id/delete` | Deletes an application by its unique ID and redirects to `/applications`. |

---

## 💡 Node.js Concepts Demonstrated

1. **Modular Architecture**:
   - `server.js` acts strictly as the server bootstrapper.
   - `routes/applications.js` isolates route handling into an `express.Router()`.
   - `middleware/validation.js` encapsulates data validation rules cleanly.
2. **Middleware Pattern**:
   - `express.urlencoded({ extended: true })` parses incoming form submissions into `req.body`.
   - `validateApplication` middleware validates user input before reaching the controller.
3. **Response Handling & Dynamic Templating**:
   - `res.render()` renders EJS templates with conditional rendering (`<% if (...) %>`), loops (`<% list.forEach(...) %>`), and dynamic counts.
   - Sets appropriate HTTP status codes (`res.status(400)` for validation errors, `200` for OK, `302` for redirects).
4. **State Preservation**:
   - Passing `formData: req.body` back to the view on validation failure pre-fills input values.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```
The server will start on `http://localhost:3000`.

### 3. Open in Browser
Visit [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Running the Automated Test Suite

To verify all server-side validation rules, data preservation, submission, and deletion:
```bash
node test-validation.js
```
The script will run 6 automated integration tests and confirm all assertions pass.
