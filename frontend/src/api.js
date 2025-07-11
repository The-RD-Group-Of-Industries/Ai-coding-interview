// src/api.js

const BASE_URL = 'http://localhost:5000'; // change this to your actual backend

export const getAssignedInterviews = async () => {
  const res = await fetch(`${BASE_URL}/user/interviews`);
  return res.json();
};

export const getQuestionsForInterview = async (interviewId) => {
  const res = await fetch(`${BASE_URL}/user/questions/${interviewId}`);
  return res.json();
};

export const submitInterview = async (interviewId, responses) => {
  const res = await fetch(`${BASE_URL}/user/interview/submit/${interviewId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ responses })
  });
  return res.json();
};
