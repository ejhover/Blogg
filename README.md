# BBBlog - Full-Stack Blogging Website

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  

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

