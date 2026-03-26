require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

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

// routes
// GET all students
app.get("/users", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// POST new student
app.post("/users", async (req, res) => {
  const newStudent = new Student(req.body);
  await newStudent.save();
  res.json({ message: "Student added" });
});

// DELETE all students
app.delete("/users", async (req, res) => {
  await Student.deleteMany({});
  res.json({ message: "All students deleted" });
});

// server start
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});