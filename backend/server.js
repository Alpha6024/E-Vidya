const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// ✅ MongoDB Connection
mongoose
  .connect("mongodb+srv://Developer1:dbdeveloper1@e-vidya-cluster.n606r.mongodb.net/")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  enrollmentNo: String,
  department: String,
  year: String,
  division: String,
  fees: { type: Boolean, default: false },  // ✅ Default false
  approved: { type: Boolean, default: false },
  requestSent: { type: Boolean, default: false }
});

// ✅ Student Model
const Student = mongoose.model("Student", studentSchema);

// ✅ Route to Add Student
app.post("/addStudent", async (req, res) => {
  try {
    const { name, enrollmentNo, department, year, division, fees = false } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ enrollmentNo });
    if (existingStudent) {
      return res.status(400).json({ error: "Student with this Enrollment No already exists" });
    }

    const newStudent = new Student({ name, enrollmentNo, department, year, division, fees });
    await newStudent.save();

    res.status(201).json({ message: "Student added successfully", newStudent });
  } catch (error) {
    res.status(500).json({ error: "Error adding student" });
  }
});

// ✅ Get Students (Filtered by Department, Year, Division)
app.get("/students", async (req, res) => {
  try {
    const { department, year, division, searchBy, searchValue } = req.query;

    let filter = {};
    if (department) filter.department = department;
    if (year) filter.year = year;
    if (division) filter.division = division;
    if (searchBy && searchValue) filter[searchBy] = new RegExp(searchValue, "i"); // Case-insensitive search

    const students = await Student.find(filter);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

// ✅ Edit Student
app.put("/editStudent/:id", async (req, res) => {
  try {
    const { name, enrollmentNo, department, year, division } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, enrollmentNo, department, year, division },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully", updatedStudent });
  } catch (error) {
    res.status(500).json({ error: "Error updating student" });
  }
});

// ✅ Delete Student
app.delete("/deleteStudent/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting student" });
  }
});

// ✅ Update Fee Status
app.put("/updateFeeStatus/:id", async (req, res) => {
  try {
    const { fees } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { fees },  
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Fee status updated", updatedStudent });
  } catch (error) {
    res.status(500).json({ message: "Error updating fee status", error });
  }
});

// ✅ Student Login API
app.post("/studentLogin", async (req, res) => {
  const { enrollmentNo } = req.body;
  const student = await Student.findOne({ enrollmentNo });

  if (!student) {
    return res.json({ message: "Student not found!" });
  }

  if (!student.approved) {
    return res.json({ message: "Not Approved", requestSent: student.requestSent });
  }

  return res.json({ message: "Login successful!", approved: true });
});

// ✅ Send Request to Staff API
app.post("/sendRequest", async (req, res) => {
  const { enrollmentNo } = req.body;
  const student = await Student.findOne({ enrollmentNo });

  if (student) {
    student.requestSent = true;
    await student.save();
    return res.json({ message: "Request sent to Staff!" });
  }

  res.status(404).json({ message: "Student not found!" });
});

// ✅ Fetch Pending Requests
app.get("/pendingRequests", async (req, res) => {
  const requests = await Student.find({ requestSent: true, approved: false });
  res.json(requests);
});

// ✅ Approve Student Request
app.post("/approveStudent", async (req, res) => {
  const { enrollmentNo } = req.body;
  
  const student = await Student.findOneAndUpdate(
    { enrollmentNo },
    { approved: true, requestSent: false },  
    { new: true }
  );

  if (student) {
    return res.json({ message: "Student Approved!", student });
  }

  res.status(404).json({ message: "Student not found!" });
});

// ✅ Remove Student Access
app.put("/removeAccess/:enrollmentNo", async (req, res) => {
  await Student.updateOne({ enrollmentNo: req.params.enrollmentNo }, { approved: false });
  res.json({ message: "Access removed" });
});
// ✅ Define Staff Schema & Model
const staffSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  address: String,
  email: String,
  subject: String,
  username: String,
  password: String,
  approved: { type: Boolean, default: true } // Staff is approved by default
});

const Staff = mongoose.model("Staff", staffSchema);

// ✅ Add Staff API (Admin Can Add Staff)
app.post("/addStaff", async (req, res) => {
  try {
      const { name, mobile, address, email, subject, username, password } = req.body;

      // Check if staff username already exists
      const existingStaff = await Staff.findOne({ username });
      if (existingStaff) {
          return res.status(400).json({ error: "Username already exists" });
      }

      const newStaff = new Staff({ name, mobile, address, email, subject, username, password });
      await newStaff.save();

      res.status(201).json({ message: "Staff added successfully", newStaff });
  } catch (error) {
      res.status(500).json({ error: "Error adding staff" });
  }
});

// ✅ Get All Staff API (For Admin to View Staff List)
app.get("/getStaffs", async (req, res) => {
  try {
      const staffs = await Staff.find();
      res.json(staffs);
  } catch (error) {
      res.status(500).json({ error: "Error fetching staff members" });
  }
});

// ✅ Delete Staff API (Admin Can Delete Staff)
app.delete("/deleteStaff/:id", async (req, res) => {
  try {
      const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
      if (!deletedStaff) {
          return res.status(404).json({ error: "Staff not found" });
      }
      res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: "Error deleting staff" });
  }
});

// ✅ Staff Login API (Only Approved Staff Can Log In)
app.post("/staffLogin", async (req, res) => {
  const { username, password } = req.body;

  try {
      const staff = await Staff.findOne({ username, password, approved: true });

      if (staff) {
          return res.json({ success: true, message: "Login Successful" });
      } else {
          return res.json({ success: false, message: "Invalid Username, Password, or Not Approved" });
      }
  } catch (error) {
      console.error("Staff Login Error:", error);
      res.status(500).json({ success: false, message: "Server Error! Try again later." });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
