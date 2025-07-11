// // src/components/SignupForm.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import bgImage from "../assets/bgImage.jpg";
// import "./SignupForm.css";

// const API_BASE_URL = "http://localhost:5000";

// export default function SignupForm() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "1234", 
//   });

//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setMessage("");

//   //   const fullName = `${formData.firstName} ${formData.lastName}`;
//   //   const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

//   //   try {
//   //     const response = await axios.post(`${API_BASE_URL}/auth/register`, {
//   //       name: fullName,
//   //       email: formData.email,
//   //       password: formData.password,
//   //       phone: formData.phone,
//   //       date: today, // Not required by API, just for reference
//   //     });

//   //     setMessage(response.data.message || "OTP sent!");
//   //   } catch (err) {
//   //     console.error(err);
//   //     setMessage("Something went wrong. Please try again.");
//   //   }

//   //   setLoading(false);
//   // };
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setMessage("");

//   const fullName = `${formData.firstName} ${formData.lastName}`;
//   const today = new Date().toISOString().split("T")[0];

//   try {
//     const response = await axios.post(`${API_BASE_URL}/auth/register`, {
//       name: fullName,
//       email: formData.email,
//       password: formData.password,
      
//     });

//     console.log(response);

//     setMessage(response.data.message || "OTP sent to your email");
//     setOtpSent(true); 
//   } catch (err) {
//     console.error(err);
//     setMessage("Something went wrong. Please try again.");
//   }

//   setLoading(false);
// };

// const handleOtpVerify = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setMessage("");

//   try {
//     const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
//       name: `${formData.firstName} ${formData.lastName}`,
//       email: formData.email,
//       password: formData.password,
//       otp: parseInt(otp),
//     });

    
//     if (res.data && res.data.email) {
//       setMessage("✅ OTP verified successfully! You are registered.");
    
//       localStorage.setItem("user", JSON.stringify(res.data));

     

//     } else {
//       setMessage("❌ OTP verification failed. Please try again.");
//     }
//   } catch (err) {
//     console.error(err);
//     setMessage("❌ Error verifying OTP. Please try again.");
//   }

//   setLoading(false);
// };

//   return (
//     <div
//       className="signup-bg"
//       style={{
//         backgroundImage: `url(${bgImage})`,
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <div className="signup-card"
//        style={{
//           backgroundImage: `url(${bgImage})`,
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "center",
//           backgroundColor: "rgba(47, 47, 54, 0.95)",
//           borderRadius: "20px",
//           boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
//           padding: "32px 28px 20px 28px",
//           width: "350px",
//           color: "#fff",
//           display: "flex",
//           flexDirection: "column",
//           gap: "18px",
//         }}
//       >
//         <div className="signup-tabs">
//           <button className="active">Sign up</button>
//           <button disabled>Sign in</button>
//           <button className="close-btn">&times;</button>
//         </div>

//         <h2 className="signup-title">Create an account</h2>

//         <form onSubmit={otpSent ? handleOtpVerify : handleSubmit}>
//           <div className="signup-row">
//             <input
//               type="text"
//               placeholder="First name"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               className="half"
//               required
//             />
//             <input
//               type="text"
//               placeholder="Last name"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               className="half"
//               required
//             />
//           </div>

//           <input
//             type="email"
//             placeholder="Enter your email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <div className="signup-row">
//             <select className="country-code" style={{ minWidth: "80px" }}>
//               <option value="+91">🇮🇳 +91</option>
//             </select>
//             <input
//               type="tel"
//               placeholder="Phone number"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="phone"
//               required
//             />
//           </div>

//           <button type="submit" className="signup-btn" disabled={loading}>
//             {loading ? "Sending OTP..." : "Create an account"}
//           </button>
//                 {otpSent && (
//     <input
//     type="number"
//     placeholder="Enter OTP"
//     value={otp}
//     onChange={(e) => setOtp(e.target.value)}
//     required
//     style={{ marginTop: "12px", padding: "8px", width: "100%" }}
//   />
// )}
          
//         </form>

//         {message && (
//           <div className="signup-message">
//             <p>{message}</p>
//           </div>
//         )}

//         <div className="signup-terms">
//           By creating an account, you agree to our <a href="#">Terms & Service</a>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import bgImage from "../assets/bgImage.jpg";
import "./SignupForm.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://ai-coding-interview.onrender.com";


export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "1234",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const fullName = `${formData.firstName} ${formData.lastName}`;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: fullName,
        email: formData.email,
        password: formData.password,
      });

      setMessage(response.data.message || "OTP sent to your email");
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  // const handleOtpVerify = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage("");

  //   try {
  //     const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
  //       name: `${formData.firstName} ${formData.lastName}`,
  //       email: formData.email,
  //       password: formData.password,
  //       otp: parseInt(otp),
  //     });

  //     if (res.data && res.data.email) {
  //       setMessage("✅ OTP verified successfully! You are registered.");
  //       localStorage.setItem("user", JSON.stringify(res.data));
  //     } else {
  //       setMessage("❌ OTP verification failed. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("❌ Error verifying OTP. Please try again.");
  //   }

  //   setLoading(false);
  // };

const handleOtpVerify = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  const payload = {
    name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
    email: formData.email.trim(),
    password: formData.password,
    otp: otp.trim(),
    phone: formData.phone.trim(),
  };

  try {
    const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, payload);

    if (res.data && res.data.user && res.data.token) {
      // Save token & user
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      // ✅ Fetch interview ID
      const interviewRes = await axios.get(`${API_BASE_URL}/user/interviews`, {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
        },
      });

      const interviewId = interviewRes.data[0]?._id;
      if (!interviewId) {
        setMessage("❌ No interview assigned to this user.");
        return;
      }

      // ✅ Save interviewId (optional)
      localStorage.setItem("interviewId", interviewId);

      // ✅ Navigate to interview page
      navigate(`/interview/${interviewId}`);
    } else {
      setMessage("❌ OTP verification failed. Please try again.");
    }
  } catch (err) {
    console.error("OTP verify error:", err.response?.data || err.message);
    setMessage(
      err.response?.data?.message ||
        "❌ Error verifying OTP. Please try again."
    );
  }

  setLoading(false);
};


  return (
    <div
      className="signup-bg"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="signup-card"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "rgba(47, 47, 54, 0.95)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          padding: "32px 28px 20px 28px",
          width: "350px",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div className="signup-tabs">
          <button className="active">Sign up</button>
          <button disabled>Sign in</button>
          <button className="close-btn">&times;</button>
        </div>

        <h2 className="signup-title">Create an account</h2>

        <form onSubmit={otpSent ? handleOtpVerify : handleSubmit}>
          <div className="signup-row">
            <input
              type="text"
              placeholder="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="half"
              required
            />
            <input
              type="text"
              placeholder="Last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="half"
              required
            />
          </div>

          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="signup-row">
            <select className="country-code" style={{ minWidth: "80px" }}>
              <option value="+91">🇮🇳 +91</option>
            </select>
            <input
              type="tel"
              placeholder="Phone number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="phone"
              required
            />
          </div>

          {otpSent && (
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={{ marginTop: "12px", padding: "8px", width: "100%" }}
            />
          )}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading
              ? otpSent
                ? "Verifying OTP..."
                : "Sending OTP..."
              : otpSent
              ? "Verify OTP"
              : "Create an account"}
          </button>
        </form>

        {message && (
          <div className="signup-message">
            <p>{message}</p>
          </div>
        )}

        <div className="signup-terms">
          By creating an account, you agree to our{" "}
          <a href="#">Terms & Service</a>
        </div>
      </div>
    </div>
  );
}
