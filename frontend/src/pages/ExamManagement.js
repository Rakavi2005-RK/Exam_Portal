import React, { useState, useEffect } from 'react';

const ExamManagement = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // Fetch exams from API (using fetch instead of axios)
    fetch('/api/exams')
      .then(response => response.json())
      .then(data => setExams(data))
      .catch(error => console.error('Error fetching exams:', error));
  }, []);

  const handleDelete = (examId) => {
    // Delete exam (using fetch instead of axios)
    fetch(`/api/exams/${examId}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          alert('Exam deleted successfully!');
          setExams(exams.filter(exam => exam.id !== examId));
        } else {
          alert('Failed to delete exam.');
        }
      })
      .catch(error => console.error('Error deleting exam:', error));
  };

  return (
    <div>
      <h2>Exam Management</h2>
      <table style={{ width: '100%', border: '1px solid #ddd', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Exam Name</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map(exam => (
            <tr key={exam.id}>
              <td>{exam.examName}</td>
              <td>{exam.subject}</td>
              <td>{exam.examDate}</td>
              <td>{exam.examDuration} mins</td>
              <td>
                <button onClick={() => handleDelete(exam.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamManagement;