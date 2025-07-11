// // src/App.js
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import SignupForm from "./components/SignupForm";
// import InterviewPage from "./components/InterviewPage/InterviewPage"; // ✅ Make sure path matches folder structure
// import InterviewList from "./components/InterviewList";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<SignupForm />} />
//       <Route path="/interview" element={<InterviewPage />} /> {/* ✅ Interview page route */}
//     </Routes>
//   );
// }

// export default App;



// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import SignupForm from "./components/SignupForm"; 
import InterviewPage from "./components/InterviewPage/InterviewPage"; 

function App() {
  return (
    <Routes>
      {/* ✅ Signup Page */}
      <Route path="/" element={<SignupForm />} />

      {/* ✅ Final Interview Page — uses interviewId param */}
      <Route path="/interview/:interviewId" element={<InterviewPage />} />
    </Routes>
  );
}

export default App;

