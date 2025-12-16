# BBBlog - Full-Stack Blogging Website

**BBBlog** is a fully functional blogging platform built with **Node.js**, **Express**, **MySQL**, and **Pug templates**. It allows users to create, edit, and delete posts, comment asynchronously, and manage accounts with admin privileges. This project demonstrates a complete end-to-end web application, including back-end APIs, front-end rendering, and user session management.

---

## 🖥 Features

- **User Accounts**
  - Register and log in with username and password
  - Admin accounts with elevated privileges
  - Admin-only features: create, edit, delete posts; delete comments

- **Blog Posts**
  - Create, edit, and delete posts (admin only)
  - Each post has a dedicated page with full content
  - Home page lists recent posts with preview
  - Pagination for browsing posts

- **Comments**
  - Users can add comments asynchronously without page reload
  - Only admins or comment authors can delete comments
  - Comments display author and timestamp

- **User-Friendly Interface**
  - Modern, clean layout with responsive design
  - Deliberate spacing, readable fonts, and styled components
  - Feedback messages for errors (e.g., failed edits, missing fields)

---

## ⚙️ Tech Stack

- **Back-End:** Node.js, Express.js
- **Front-End:** Pug templating engine, CSS for styling
- **Database:** MySQL
- **Session Management:** `express-session` for user login persistence
- **AJAX:** Fetch API for async comment creation and deletion
- **Other:** Vanilla JavaScript for interactivity

---

## 📂 Folder Structure
```bash
BBBlog/
├─ templates/ # Pug templates
├─ resources/ # Static files (CSS, JS, images)
├─ data.js # Database interactions
├─ server.js # Express server
├─ package.json
└─ README.md
```


---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MySQL server
- npm package manager

### Installation
1. Clone the repository:
```bash
git clone https://github.com/YourUsername/BBBlog.git
cd BBBlog
```
2. Install dependencies
```bash
npm install
```
3. Start the server
```bash
node server.js
```
4. Visit page
```bash
http://localhost:4131
```

