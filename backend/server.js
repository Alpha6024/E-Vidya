const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// ✅ MongoDB Connection
mongoose
  .connect("mongodb+srv://Developer1:dbdeveloper1@e-vidya-cluster.n606r.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
  isApproved: { type: Boolean, default: false },
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


// ✅ Get students based on filters
app.get("/students", async (req, res) => {
    try {
        const { department, year, division } = req.query;

        let filter = {};
        if (department) filter.department = department;
        if (year) filter.year = year;
        if (division) filter.division = division;

        const students = await Student.find(filter);
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error });
    }
});


// ✅ Route to Fetch Students (Supports Search)
app.get("/students", async (req, res) => {
  try {
    const { searchBy, searchValue } = req.query;

    let query = {};
    if (searchBy && searchValue) {
      query[searchBy] = new RegExp(searchValue, "i"); // Case-insensitive search
    }

    const students = await Student.find(query);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

// ✅ Route to Edit Student
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

// ✅ Route to Delete Student (Fixed)
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

// ✅ Get students based on Department, Year, and Division
app.get("/students", async (req, res) => {
  try {
      const { department, year, division } = req.query;
      let filter = {};

      if (department) filter.department = department;
      if (year) filter.year = year;
      if (division) filter.division = division;

      const students = await Student.find(filter);
      res.json(students);
  } catch (error) {
      res.status(500).json({ message: "Error fetching students", error });
  }
});

app.put("/updateFeeStatus/:id", async (req, res) => {
  try {
    const { fees } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { fees },  // ✅ Update only the fees field
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
  //announements
// ✅ Define Announcement Schema
const announcementSchema = new mongoose.Schema({
  title: String,
  message: String,
  date: { type: String, default: new Date().toLocaleDateString() }
});

// ✅ Announcement Model
const Announcement = mongoose.model("Announcement", announcementSchema);

// ✅ Route to Create Announcement
app.post("/addAnnouncement", async (req, res) => {
  try {
    const { title, message } = req.body;
    const newAnnouncement = new Announcement({ title, message });
    await newAnnouncement.save();
    res.status(201).json({ message: "Announcement posted successfully", newAnnouncement });
  } catch (error) {
    res.status(500).json({ error: "Error posting announcement" });
  }
});

// ✅ Route to Fetch Announcements
app.get("/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ _id: -1 }); // Show latest first
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Error fetching announcements" });
  }
});

// ✅ Route to Delete Announcement
app.delete("/deleteAnnouncement/:id", async (req, res) => {
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting announcement" });
  }
});

// ✅ Study Material Schema
const studyMaterialSchema = new mongoose.Schema({
  title: String,
  type: String, // "link" or "file"
  content: String, // URL or File Path
  department: String,
  year: String,
  uploadDate: { type: Date, default: Date.now },
});

// ✅ Study Material Model
const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);

// ✅ Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Route to Upload Study Material
app.post("/uploadMaterial", upload.single("file"), async (req, res) => {
  try {
    const { title, type, content, department, year } = req.body;
    let filePath = null;

    if (type === "file" && req.file) {
      filePath = `/uploads/${req.file.filename}`;
    }

    const newMaterial = new StudyMaterial({
      title,
      type,
      content: type === "link" ? content : filePath,
      department,
      year,
    });

    await newMaterial.save();
    res.status(201).json({ message: "Study Material Uploaded", newMaterial });
  } catch (error) {
    res.status(500).json({ error: "Error uploading study material", error });
  }
});

// ✅ Route to Fetch Study Materials Based on Department & Year
app.get("/materials", async (req, res) => {
  try {
      const { department, year } = req.query;

      if (!department || !year) {
          return res.status(400).json({ error: "Department and Year are required" });
      }

      const materials = await StudyMaterial.find({ department, year });

      res.json(Array.isArray(materials) ? materials : []);
  } catch (error) {
      console.error("Error fetching materials:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});
// ✅ Get Study Materials (Filtered by Department & Year)
// ✅ Get Study Materials (Filtered by Department & Year)
app.get("/materials", async (req, res) => {
  try {
      const { department, year } = req.query;
      let filter = {};
      if (department) filter.department = department;
      if (year) filter.year = year;

      const materials = await StudyMaterial.find(filter);
      res.json(materials);
  } catch (error) {
      res.status(500).json({ error: "Error fetching materials" });
  }
});

// ✅ Delete Study Material by ID
app.delete("/deleteMaterial/:id", async (req, res) => {
  try {
      const deletedMaterial = await StudyMaterial.findByIdAndDelete(req.params.id);
      if (!deletedMaterial) {
          return res.status(404).json({ error: "Material not found" });
      }
      res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: "Error deleting material" });
  }
});
app.get("/getStudent", async (req, res) => {
  try {
      const { enrollmentNo } = req.query;
      const student = await Student.findOne({ enrollmentNo });

      if (!student) {
          return res.status(404).json({ error: "Student not found" });
      }

      res.json(student);
  } catch (error) {
      res.status(500).json({ error: "Error fetching student" });
  }
});
// ✅ Define Report Schema
const reportSchema = new mongoose.Schema({
  enrollmentNo: String,
  name: String,
  department: String,
  year: String,
  unitTest1: Array,
  unitTest2: Array,
  attendance: Number,
  oralMarks: Number,
  submission: Boolean
});

const Report = mongoose.model("Report", reportSchema);

// ✅ Save Report
app.post("/saveReport", async (req, res) => {
  try {
      const newReport = new Report(req.body);
      await newReport.save();
      res.status(201).json({ message: "Report saved successfully" });
  } catch (error) {
      res.status(500).json({ error: "Error saving report" });
  }
});

// ✅ Get Reports Based on Dept & Year
app.get("/reports", async (req, res) => {
  try {
      const { department, year } = req.query;
      const reports = await Report.find({ department, year });
      res.json(reports);
  } catch (error) {
      res.status(500).json({ error: "Error fetching reports" });
  }
});

// ✅ Edit Report (Attendance & Oral Marks)
app.put("/editReport/:id", async (req, res) => {
  try {
      const updatedReport = await Report.findByIdAndUpdate(
          req.params.id,
          { attendance: req.body.attendance, oralMarks: req.body.oralMarks },
          { new: true }
      );
      if (!updatedReport) return res.status(404).json({ error: "Report not found" });
      res.json({ message: "Report updated", updatedReport });
  } catch (error) {
      res.status(500).json({ error: "Error editing report" });
  }
});

// ✅ Delete Report
app.delete("/deleteReport/:id", async (req, res) => {
  try {
      const deletedReport = await Report.findByIdAndDelete(req.params.id);
      if (!deletedReport) return res.status(404).json({ error: "Report not found" });
      res.json({ message: "Report deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: "Error deleting report" });
  }
});
// ✅ Edit Report (Update UT1 & UT2 Marks)
app.put("/editReport/:id", async (req, res) => {
  try {
      const updatedReport = await Report.findByIdAndUpdate(
          req.params.id,
          {
              unitTest1: req.body.unitTest1,
              unitTest2: req.body.unitTest2
          },
          { new: true }
      );

      if (!updatedReport) {
          return res.status(404).json({ error: "Report not found" });
      }

      res.json({ message: "Report updated", updatedReport });
  } catch (error) {
      res.status(500).json({ error: "Error editing report" });
  }
});


// ✅ Login Requests Schema
const loginRequestSchema = new mongoose.Schema({
  enrollmentNo: String,
  status: { type: String, default: "Pending" }, // Pending, Approved, Rejected
});
const LoginRequest = mongoose.model("LoginRequest", loginRequestSchema);

// ✅ Validate Student Login & Request Access
app.post("/studentLogin", async (req, res) => {
  const { enrollmentNo } = req.body;
  const student = await Student.findOne({ enrollmentNo });

  if (!student) {
    return res.status(404).json({ message: "Enrollment No not found!" });
  }

  if (student.isApproved) {
    return res.json({ message: "Login successful!" });
  }

  // Check if request is already sent
  const existingRequest = await LoginRequest.findOne({ enrollmentNo });
  if (existingRequest) {
    return res.json({ message: "Your request is pending approval!" });
  }

  // Send login request
  const newRequest = new LoginRequest({ enrollmentNo });
  await newRequest.save();
  res.json({ message: "Login request sent to staff for approval." });
});

// ✅ Fetch Pending Login Requests (For Staff)
app.get("/pendingRequests", async (req, res) => {
  const requests = await LoginRequest.find({ status: "Pending" });
  res.json(requests);
});

// ✅ Approve or Reject Student Login (Staff)
app.put("/approveLogin/:id", async (req, res) => {
  const { status } = req.body;
  const request = await LoginRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: "Request not found!" });
  }

  if (status === "Approved") {
    await Student.updateOne({ enrollmentNo: request.enrollmentNo }, { isApproved: true });
  }

  request.status = status;
  await request.save();
  res.json({ message: `Student login ${status}` });
});

// ✅ Remove Student Access
app.put("/removeAccess/:enrollmentNo", async (req, res) => {
  await Student.updateOne({ enrollmentNo: req.params.enrollmentNo }, { isApproved: false });
  res.json({ message: "Access removed" });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
