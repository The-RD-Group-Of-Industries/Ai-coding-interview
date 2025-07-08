import React, { useEffect, useState } from 'react';
import { interviewAPI } from '../../api/apiService';

export default function Dashboard() {
  const [interviews, setInterviews] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewsRes, submissionsRes] = await Promise.all([
          interviewAPI.getAllInterviews(),
          interviewAPI.getSubmittedInterviews()
        ]);
        
        setInterviews(interviewsRes || []);
        setSubmissions(submissionsRes || []);
      
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="main-content-1">
      <h1 className="dashboard-header">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-title">Total Interviews</div>
            

          <div className="stat-value">{interviews.length}</div>
        </div>
        
        <div className="stat-card stat-card-success">
          <div className="stat-title">Submitted Interviews</div>
          <div className="stat-value">{submissions.length}</div>
        </div>
        
        <div className="stat-card stat-card-info">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{users.length}</div>
        </div>
      </div>
      
      <div className="section-card">
        <h2 className="section-title">Recent Interviews</h2>
        
        {interviews.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Applied For</th>
                  <th>Difficulty</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {interviews.slice(0, 5).map((interview) => (
                  <tr key={interview._id}>
                    <td>{interview._id.substring(0, 6)}...</td>
                    <td>{interview.name}</td>
                    <td>{interview.appliedFor}</td>
                    <td>{interview.difficultyLevel}</td>
                    <td>{new Date(interview.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            No interviews created yet.
          </div>
        )}
      </div>
    </div>
  );
}

// Add default props for safety (optional)
Dashboard.defaultProps = {
  interviews: [],
  submissions: [],
  users: []
};