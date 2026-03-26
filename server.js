require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Added this to handle folder paths

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// 1. SERVE FRONTEND FILES
// This tells the server to look inside the "frontend" folder for CSS/JS
app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Error:", err);
  });

// schema
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  course: String,
  marks: String
});
const Student = mongoose.model("Student", studentSchema);

// 2. MAIN ROUTE (SHOW YOUR WEBSITE)
// Instead of just saying "Server is running", this sends your actual index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

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

// server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 404 Fallback - Keep this at the bottom
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});