import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const viewann = () => {
  const [announcements, setAnnouncements] = useState([]);

  // ✅ Fetch Announcements from Backend
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* ✅ Header */}
        <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Announcements</h1>
          <Link to={"/Student"} className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition">
            &#8592; Go Back
          </Link>
        </header>

        <main className="p-6">
          {/* ✅ Display Posted Announcements */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Announcements</h2>
            {announcements.length > 0 ? (
              <ul className="space-y-4">
                {announcements.map((announcement) => (
                  <li key={announcement._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-xl font-semibold text-blue-600">{announcement.title}</p>
                    <p className="text-gray-700 mt-1">{announcement.message}</p>
                    <p className="text-gray-500 text-sm mt-2">📅 {announcement.date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No announcements available.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default viewann;
