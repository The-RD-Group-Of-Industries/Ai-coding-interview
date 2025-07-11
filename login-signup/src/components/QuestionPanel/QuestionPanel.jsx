// import React, { useState } from 'react';
// import './QuestionPanel.css';

// const QuestionPanel = () => {
//   const [selected, setSelected] = useState(3);

//   const options = [
//     'This is the answer here',
//     'This is the answer here',
//     'This is the answer here',
//     'This is the answer here'
//   ];

//   return (
//     <div className="question-panel">
//       <div className="question-header">
//         <span className="question-number">01/15</span>
//       </div>
//       <div className="question-text">
//         <h2>What is the difference between === and == in Javascript?</h2>
//       </div>

//       <div className="options-section">
//         <span className="options-label">Options</span>
//         {options.map((opt, index) => (
//           <label
//             key={index}
//             className={`option ${selected === index ? 'selected' : ''}`}
//             onClick={() => setSelected(index)}
//           >
//             <input type="radio" name="option" checked={selected === index} readOnly />
//             <span>{opt}</span>
//           </label>
//         ))}
//       </div>

//       <div className="buttons">
//         <button className="discard-btn">Discard</button>
//         <button className="next-btn">Next</button>
//       </div>
//     </div>
//   );
// };

// export default QuestionPanel;


// import React from 'react';
// import './QuestionPanel.css';

// const QuestionPanel = ({ question, options, selectedOption, onSelect }) => {
//   return (
//     <div className="question-panel">
//       <div className="question-header">
//         <span className="question-number">01/15</span>
//       </div>

//       <div className="question-text">
//         <h2>What is the difference between === and == in Javascript?</h2>
//       </div>

//       <div className="options-section">
//         <span className="options-label">Options</span>
//         {options.map((option, idx) => (
//           <label className={`option ${selectedOption === idx ? 'selected' : ''}`} key={idx}>
//             <input
//               type="radio"
//               name="option"
//               value={option}
//               checked={selectedOption === idx}
//               onChange={() => onSelect(idx)} // ✅ safe now
//             />
//             {option}
//           </label>
//         ))}
//       </div>

//       <div className="buttons">
//         <button className="discard-btn">Discard</button>
//         <button className="next-btn">Next</button>
//       </div>
//     </div>
//   );
// };

// export default QuestionPanel;


import React from 'react';
import './QuestionPanel.css';

const QuestionPanel = ({
  question = "What is the difference between === and == in Javascript?",
  options = [],
  selectedOption,
  onSelect = () => {},
}) => {
  return (
    <div className="question-panel">
      {/* Question Number */}
      <div className="question-header">
        <span className="question-number">01/15</span>
      </div>

      {/* Question Text */}
      <div className="question-text">
        <h2>{question}</h2>
      </div>

      {/* Options */}
      <div className="options-section">
        <span className="options-label">Options</span>
        {options.map((option, idx) => (
          <label
            className={`option ${selectedOption === idx ? 'selected' : ''}`}
            key={idx}
            onClick={() => onSelect(idx)}
          >
            <input
              type="radio"
              name="option"
              value={option}
              checked={selectedOption === idx}
              readOnly
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="buttons">
        <button className="discard-btn">Discard</button>
        <button className="next-btn">Next</button>
      </div>
    </div>
  );
};

export default QuestionPanel;
