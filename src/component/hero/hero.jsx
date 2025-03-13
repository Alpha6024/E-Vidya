import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [enrollmentNo, setEnrollmentNo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // ✅ Student Login (Sends Request to Staff)
    const handleStudentLogin = async () => {
        try {
            const response = await fetch("http://localhost:5000/studentLogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enrollmentNo }),
            });

            const data = await response.json();
            setMessage(data.message);

            if (data.message === "Login successful!") {
                navigate("/Student");
            }
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    // ✅ Staff & Admin Login
    const handleAdminStaffLogin = () => {
        if (username === "staff" && password === "12345") {
            navigate("/Staff");
        } else if (username === "admin" && password === "54321") {
            navigate("/Admin");
        } else {
            setMessage("Invalid Username or Password");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-200">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">E-Vidya Login</h1>

                {/* ✅ Student Login */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter Enrollment No"
                        value={enrollmentNo}
                        onChange={(e) => setEnrollmentNo(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <button onClick={handleStudentLogin} className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">
                        Student Login
                    </button>
                </div>

                {/* ✅ Staff/Admin Login */}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <button onClick={handleAdminStaffLogin} className="bg-green-500 text-white px-4 py-2 rounded w-full">
                    Staff/Admin Login
                </button>

                <p className="mt-3 text-red-600">{message}</p>
            </div>
        </div>
    );
};

export default Login;
