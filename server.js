require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Essential for MongoDB Atlas connection issues
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 1. SERVE FRONTEND FILES ---
// This looks inside the "frontend" folder for index.html, CSS, and JS
app.use(express.static(path.join(__dirname, 'frontend')));

// --- 2. MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

// --- 3. DATABASE SCHEMA ---
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  course: String,
  marks: String
});
const Student = mongoose.model("Student", studentSchema);

// --- 4. API ROUTES ---

// GET all students
app.get("/users", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new student
app.post("/users", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.json({ message: "Student added" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE all students
app.delete("/users", async (req, res) => {
  try {
    await Student.deleteMany({});
    res.json({ message: "All students deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 5. THE "CATCH-ALL" ROUTE ---
// This version works with the newest Express 5.0 syntax
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// --- 6. SERVER START ---
const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is live on port ${PORT}`);
});