import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Fetch Announcements from Database
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("http://localhost:5000/announcements");
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  // ✅ Fetch Announcements on Component Load
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ✅ Handle Announcement Submission (POST)
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert("Please fill out both fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/addAnnouncement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to post announcement");
      }

      setTitle("");
      setMessage("");
      fetchAnnouncements(); // Refresh announcements after posting
    } catch (error) {
      console.error("Error posting announcement:", error);
    }
  };

  // ✅ Delete Announcement (DELETE)
  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const response = await fetch(`http://localhost:5000/deleteAnnouncement/${id}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete announcement");
      }

      fetchAnnouncements(); // Refresh announcements after deletion
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* ✅ Header */}
        <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Create Announcements</h1>
          <Link to={"/Staff"} className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition">
            &#8592; Go Back
          </Link>
        </header>

        <main className="p-6">
          {/* ✅ Announcement Form */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Post a New Announcement</h2>
            <form onSubmit={handleAnnouncementSubmit} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter announcement title"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter announcement details"
                  rows="4"
                ></textarea>
              </div>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Post Announcement
              </button>
            </form>
          </section>

          {/* ✅ Display Posted Announcements */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Posted Announcements</h2>
            {announcements.length > 0 ? (
              <ul className="space-y-4">
                {announcements.map((announcement) => (
                  <li key={announcement._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col space-y-2">
                    <div>
                      <p className="text-xl font-semibold text-blue-600">{announcement.title}</p>
                      <p className="text-gray-700 mt-1">{announcement.message}</p>
                      <p className="text-gray-500 text-sm mt-2">{announcement.date}</p>
                    </div>
                    <button onClick={() => deleteAnnouncement(announcement._id)} className="text-red-500 hover:text-red-700 font-medium self-end mt-2">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No announcements posted yet.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
