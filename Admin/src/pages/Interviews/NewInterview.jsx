import React, { useState } from 'react';
import { interviewAPI } from './../../api/apiService';

export default function NewInterviewForm() {
  // ... existing state declarations ...
  const [name, setName] = useState("");
  const [appliedFor, setAppliedFor] = useState("");
  const [description, setDescription] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [skillSets, setSkillSets] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [focusStackArea, setFocusStackArea] = useState("");
  const [codingLanguage, setCodingLanguage] = useState("");
  const [numQuestions, setNumQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [slugLink, setSlugLink] = useState(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newAnswerText, setNewAnswerText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const difficultyLevelOptions = ["Easy", "Medium", "Hard"];
  // Add a question to the questions array
  const addQuestion = () => {
    if (!newQuestionText.trim()) {
      alert("Please enter a question");
      return;
    }
    setQuestions((prev) => [
      ...prev,
      { question: newQuestionText.trim(), answer: newAnswerText.trim() || null },
    ]);
    setNewQuestionText("");
    setNewAnswerText("");
  };

  // Add new skill to skillSets array
  const addSkill = () => {
    if (newSkillInput.trim() && !skillSets.includes(newSkillInput.trim())) {
      setSkillSets([...skillSets, newSkillInput.trim()]);
      setNewSkillInput("");
    }
  };

  // Remove skill from skillSets array
  const removeSkill = (skillToRemove) => {
    setSkillSets(skillSets.filter(skill => skill !== skillToRemove));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !appliedFor || !description || 
        !difficultyLevel || !focusStackArea || !codingLanguage || 
        skillSets.length === 0) {
      alert("Please complete all required fields.");
      return;
    }

    if (questions.length !== Number(numQuestions)) {
      alert(
        `Number of questions mismatch. You specified ${numQuestions}, but added ${questions.length}. Please fix.`
      );
      return;
    }

    const slug = name.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-") + "-" + Date.now();


    const interview = {
      name: name.trim(),
      appliedFor: appliedFor.trim(),
      description: description.trim(),
      difficultyLevel: difficultyLevel.toLowerCase(),
      skillSets: skillSets, 
      focusStackArea: focusStackArea.trim(),
      codingLanguage: codingLanguage.trim(),
      numberOfQuestions: Number(numQuestions),
      questions: questions.map(q => ({
        question: q.question.trim(),
        expectedAnswer: q.answer?.trim() || "" 
      })),
      // codingLanguage: "PYTHON" 
    };

    if (Object.values(interview).some(
      field => field === "" ||
        field === null ||
        (Array.isArray(field) && field.length === 0)
    )) {
      setError("All fields must be filled properly");
      return;
    }

    console.log("Submitting interview:", interview);
    setLoading(true);

    setLoading(true);
    try {
      const response = await interviewAPI.createInterview(interview);
      // onSave(response.data);
  //     if (typeof onSave === 'function') {
  //   onSave(response.data);
  // }

      setSlugLink(null)
      setName("");
      setAppliedFor("");
      setDescription("");
      setDifficultyLevel("");
      setSkillSets([]);
      setFocusStackArea("");
      setNumQuestions(0);
      setQuestions([]);
      setNewQuestionText("");
      setNewAnswerText("");

      alert("New Interview saved successfully!");
    } catch (err) {
      console.error("Submission error:", {
        error: err,
        requestData: interview
      });
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-interview-container">
      <h2 className="new-interview-title">Create New Interview</h2>
      <form onSubmit={handleSubmit} className="interview-form">
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input
            type="text"
            className="form-input"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Applied For *</label>
          <input
            type="text"
            className="form-input"
            required
            value={appliedFor}
            onChange={(e) => setAppliedFor(e.target.value)}
            aria-label="Applied For"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description of Interview *</label>
          <textarea
            className="form-input form-textarea"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-label="Description"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Difficulty Level *</label>
          <select
            className="form-select"
            required
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            aria-label="Difficulty Level"
          >
            <option value="">-- Select --</option>
            {difficultyLevelOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <fieldset className="skills-fieldset">
          <legend className="skills-legend">Skills Sets</legend>
          <div className="skills-input-container">
            <input
              type="text"
              className="form-input"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add new skill"
              aria-label="Add new skill"
            />
            <button
              type="button"
              onClick={addSkill}
              className="add-skill-button"
              aria-label="Add skill"
            >
              +
            </button>
          </div>
          <div className="skills-pills-container">
            {skillSets.map((skill, index) => (
              <div key={index} className="skill-pill">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="remove-skill-button"
                  aria-label={`Remove skill ${skill}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="form-group">
          <label className="form-label">Focus Stack Area *</label>
          <input
            type="text"
            className="form-input"
            required
            value={focusStackArea}
            onChange={(e) => setFocusStackArea(e.target.value)}
            aria-label="Focus Stack Area"
          />
        </div>

         <div className="form-group">
        <label className="form-label">Coding Language *</label>
        <input
          type="text"
          className="form-input"
          required
          name="codingLanguage"
          value={codingLanguage}
          onChange={(e) => setCodingLanguage(e.target.value)}
          aria-label="Coding Language"
        />
      </div>

        <div className="form-group">
          <label className="form-label">Number of Questions *</label>
          <input
            type="number"
            className="form-input"
            required
            min={0}
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            aria-label="Number of Questions"
          />
        </div>

        <div className="questions-section">
          {/* <h4>Add Questions (optional) {questions.length} added</h4> */}
          {/* <p>Add multiple questions and answers. Questions count must match "Number of Questions"</p> */}

          <div className="form-group">
            <label className="form-label">Question Text</label>
            <input
              type="text"
              className="form-input"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              aria-label="New Question Text"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Answer (optional)</label>
            <textarea
              className="form-input form-textarea"
              value={newAnswerText}
              onChange={(e) => setNewAnswerText(e.target.value)}
              aria-label="New Question Answer (optional)"
            />
          </div>
          <br />
          <button
            type="button"
            onClick={addQuestion}
            className="submit-button"
            aria-label="Add Question"
          >
            Add Question
          </button>

          {questions.length > 0 && (
            <div className="questions-list">
              <h5>Questions List:</h5>
              <ol>
                {questions.map((q, i) => (
                  <li key={i} className="question-item">
                    <strong>Q:</strong> {q.question}
                    {q.answer && (
                      <>
                        <br />
                        <strong>A:</strong> {q.answer}
                      </>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          aria-label="Submit New Interview"
          disabled={loading}
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>

      {slugLink && (
        <div className="slug-link-container" style={{ marginTop: "1rem", fontWeight: "bold" }}>
          Slug Link Generated: <code>{slugLink}</code>
        </div>
      )}

      {error && (
        <div className="error-message" style={{ color: "red", marginTop: "1rem" }}>
          Error: {error}
        </div>
      )}
    </div>
  )
}