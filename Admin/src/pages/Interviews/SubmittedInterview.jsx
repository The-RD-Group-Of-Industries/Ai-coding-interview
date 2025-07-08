import React, { useState } from 'react';
import { interviewAPI } from './../../api/apiService';

export default function SubmittedInterviews({ submissions = [], onDelete, onUpdate }) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");

 const openSubmission = (submission) => {
    setSelectedSubmission(submission);
    setFeedbackText(submission.feedback || "");
  };

  const closeDetails = () => {
    setSelectedSubmission(null);
  };

  const handleSelect = async () => {
    if (!selectedSubmission) return;
    
    try {
      const response = await interviewAPI.selectUser(
        selectedSubmission.attendedBy, 
        selectedSubmission.interviewId
      );
      
      const updated = {
        ...selectedSubmission,
        status: "selected",
        feedback: feedbackText,
      };
      
      onUpdate(updated);
      alert(`Candidate selected successfully! Email has been sent.`);
      closeDetails();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleReject = () => {
    if (!selectedSubmission) return;
    const updated = {
      ...selectedSubmission,
      status: "rejected",
      feedback: feedbackText,
    };
    onUpdate(updated);
    alert(`Candidate rejected. Feedback saved.`);
    closeDetails();
  };

  return (
    <div className="submitted-interviews-container">
      <h2 className="submitted-interviews-title">Submitted Interviews</h2>
      <table className="interviews-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Applied For</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions && submissions.length > 0 ? (
            submissions.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.appliedFor}</td>
              <td>{s.status || "pending"}</td>
              <td>
                <button
                  onClick={() => openSubmission(s)}
                  className="action-button open-button"
                  aria-label={`Open submission for ${s.name}`}
                >
                  Open
                </button>
                <button
                  onClick={() => onDelete(s.id)}
                  className="action-button delete-button"
                  aria-label={`Delete submission for ${s.name}`}
                >
                  Delete
                </button>
              </td>
            </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-submissions">
                No submissions available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Details modal */}
      {selectedSubmission && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <h3 className="modal-title">
              Submission Details - {selectedSubmission.name} ({selectedSubmission.email})
            </h3>
            <div className="modal-content">
              <p>
                <strong>Applied For:</strong> {selectedSubmission.appliedFor}
              </p>
              <p>
                <strong>Description:</strong> {selectedSubmission.description}
              </p>
              <p>
                <strong>Status:</strong> {selectedSubmission.status || "pending"}
              </p>
              <p>
                <strong>Answers:</strong>
              </p>
              {selectedSubmission.answers?.map((a, idx) => (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <strong>Q{idx + 1}:</strong> {a.question}
                  <br />
                  <strong>A:</strong> {a.answer}
                </div>
              ))}

              <hr />
              <label>
                Feedback (optional):
                <textarea
                  className="feedback-textarea"
                  aria-label="Feedback textarea"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
              </label>
            </div>

            <div className="modal-actions">
              <button
                onClick={handleSelect}
                className="modal-button selected-button"
                aria-label="Mark as Selected"
              >
                Selected
              </button>
              <button
                onClick={handleReject}
                className="modal-button rejected-button"
                aria-label="Mark as Rejected"
              >
                Rejected
              </button>
              <button
                onClick={closeDetails}
                className="modal-button close-button"
                aria-label="Close details modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}