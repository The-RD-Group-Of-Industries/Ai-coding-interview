

// import React, { useEffect, useState } from "react";
// import CodeEditorPanel from "../CodeEditorPanel/CodeEditorPanel";
// import QuestionPanel from "../QuestionPanel/QuestionPanel";
// import "./InterviewPage.css";
// import axios from "axios";

// const API_BASE_URL = "https://ai-coding-interview.onrender.com";

// const InterviewPage = () => {
//   const [started, setStarted] = useState(false);
//   const [interviewId, setInterviewId] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 1️⃣ Fetch assigned interviewId
//   useEffect(() => {
//     const fetchInterviewId = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return console.error("❌ Token not found");

//       try {
//         const res = await axios.get(`${API_BASE_URL}/user/interviews`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (res.data.length > 0) {
//           setInterviewId(res.data[0]._id);
//         } else {
//           console.warn("❌ No interview assigned to this user.");
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error("❌ Error fetching interview ID:", err);
//         setLoading(false);
//       }
//     };

//     fetchInterviewId();
//   }, []);

//   // 2️⃣ Fetch questions once interviewId is available
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       if (!interviewId) return;

//       const token = localStorage.getItem("token");
//       try {
//         const res = await axios.get(
//           `${API_BASE_URL}/user/questions/${interviewId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setQuestions(res.data.questions || []);
//       } catch (err) {
//         console.error("❌ Error fetching questions:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [interviewId]);



//   console.log(interviewId);

//   // 3️⃣ Handle option selection
//   const handleSelectOption = (idx) => {
//     setSelectedOption(idx);
//   };

//   // 4️⃣ Move to next question
//   const handleNext = () => {
//     setSelectedOption(null);
//     setCurrentQuestionIndex((prev) => prev + 1);
//   };

//   const currentQuestion = questions[currentQuestionIndex];

//   // 5️⃣ Show loading state
//   if (loading) {
//     return <p style={{ color: "white", padding: "2rem" }}>⏳ Loading interview...</p>;
//   }

//   return (
//     <div className="interview-page-container">
//       {/* 🟣 Overlay Before Start */}
//       {!started && (
//         <div className="overlay">
//           <div className="overlay-content">
//             <h1>Welcome to Your Interview</h1>
//             <button className="start-btn" onClick={() => setStarted(true)}>
//               Start Interview
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 🟢 Main Interview Panel */}
//       <div className={`interview-page ${!started ? "blurred" : ""}`}>
//         <div className="code-panel-wrapper">
//           <CodeEditorPanel />
//         </div>

//         <div className="question-panel-wrapper">
//           {currentQuestion ? (
//             <>
//               <QuestionPanel
//                 question={currentQuestion.question}
//                 options={currentQuestion.options}
//                 selectedOption={selectedOption}
//                 onSelect={handleSelectOption}
//               />

//               {/* 🔘 Next Button */}
//               {currentQuestionIndex < questions.length - 1 && (
//                 <button
//                   className="next-btn"
//                   onClick={handleNext}
//                   style={{ marginTop: "20px" }}
//                 >
//                   Next Question
//                 </button>
//               )}

//               {/* ✅ Last Question Message */}
//               {currentQuestionIndex === questions.length - 1 && (
//                 <p style={{ color: "lightgreen", marginTop: "20px" }}>
//                   ✅ You’ve reached the last question.
//                 </p>
//               )}
//             </>
//           ) : (
//             <p style={{ color: "white" }}>❌ No questions found for this interview.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewPage;

// src/pages/InterviewPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CodeEditorPanel from "../CodeEditorPanel/CodeEditorPanel";
import QuestionPanel from "../QuestionPanel/QuestionPanel";
import "./InterviewPage.css";


const API_BASE_URL = "https://ai-coding-interview.onrender.com";

const InterviewPage = () => {
  const { interviewId } = useParams(); 

  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch questions for this interview ID
  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found");
        return;
      }

      try {
        const res = await axios.get(
          `${API_BASE_URL}/user/questions/${interviewId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("❌ Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [interviewId]);

  // ✅ Handle option selection
  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
  };

  // ✅ Move to next question
  const handleNext = () => {
    setSelectedOption(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const currentQuestion = questions[currentQuestionIndex];

  // ✅ Loading state
  if (loading) {
    return (
      <p style={{ color: "white", padding: "2rem" }}>⏳ Loading questions...</p>
    );
  }

  return (
    <div className="interview-page-container">
      {/* Start Overlay */}
      {!started && (
        <div className="overlay">
          <div className="overlay-content">
            <h1>Welcome to Your Interview</h1>
            <button className="start-btn" onClick={() => setStarted(true)}>
              Start Interview
            </button>
          </div>
        </div>
      )}

      {/* Main Page */}
      <div className={`interview-page ${!started ? "blurred" : ""}`}>
        <div className="code-panel-wrapper">
          <CodeEditorPanel />
        </div>

        <div className="question-panel-wrapper">
          {currentQuestion ? (
            <>
              <QuestionPanel
                question={currentQuestion.question}
                options={currentQuestion.options}
                selectedOption={selectedOption}
                onSelect={handleSelectOption}
              />

              {currentQuestionIndex < questions.length - 1 && (
                <button
                  className="next-btn"
                  onClick={handleNext}
                  style={{ marginTop: "20px" }}
                >
                  Next Question
                </button>
              )}

              {currentQuestionIndex === questions.length - 1 && (
                <p style={{ color: "lightgreen", marginTop: "20px" }}>
                  ✅ You’ve reached the last question.
                </p>
              )}
            </>
          ) : (
            <p style={{ color: "white" }}>❌ No questions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;






