import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';

const TaskSession = () => {
  const { id, chapterId } = useParams();  // Get both session ID and chapter ID
  const [tasks, setTasks] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract chapter number from chapterId (e.g., "chapter1" -> 1)
  const chapterNum = parseInt(chapterId.replace('chapter', ''));

  // Fetch tasks from backend for specific chapter
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tasks/get-tasks/${chapterNum}`);
        setTasks(response.data);
      } catch (err) {
        console.error('Fetch tasks failed', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [chapterNum]);

  const [vmStatus, setVmStatus] = useState('stopped');
  const [vmUrl, setVmUrl] = useState(null);
  const handleStartLab = async () => {
    try {
      setVmStatus('starting');
      const response = await api.post('/start-vm', {
        session_id: id
      });
      
      if (response.data.status === 'success') {
        setVmStatus('running');
        setVmUrl(response.data.vm_url);
      }
    } catch (error) {
      console.error('Failed to start VM:', error);
      setVmStatus('stopped');
      alert('Failed to start the lab environment');
    }
  };

  const handleAnswerChange = (taskId, value) => {
    setAnswers(prev => ({ ...prev, [taskId]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/tasks/submit-task', {
        session_id: id,
        answers: answers
      });

      if (vmStatus === 'running') {
        await api.post('/stop-vm', { session_id: id });
        setVmStatus('stopped');
        setVmUrl(null);
      }

      alert(`Your score: ${response.data.score}`);
    } catch (err) {
      console.error('Submit error', err);
      alert('Submission failed.');
    }
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '1rem' }}>
      {/* Tasks Panel - Now centered and wider */}
      <div style={{ width: '80%', margin: '0 auto', maxWidth: '800px' }}>
        <h2>Practice Questions</h2>
        {tasks.map((task, idx) => (
          <div key={task.id} style={{ 
            marginBottom: '2rem',
            backgroundColor: '#1f2937',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              <strong>Question {idx + 1}:</strong> {task.question}
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <details>
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  Need a hint?
                </summary>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>Hint 1: {task.hint1}</li>
                  <li style={{ marginBottom: '0.5rem' }}>Hint 2: {task.hint2}</li>
                  <li style={{ marginBottom: '0.5rem' }}>Hint 3: {task.hint3}</li>
                </ul>
              </details>
            </div>
            <input
              type="text"
              value={answers[task.id] || ''}
              onChange={e => handleAnswerChange(task.id, e.target.value)}
              placeholder="Enter your answer"
              style={{
                width: '100%',
                padding: '0.75rem',
                marginTop: '0.5rem',
                backgroundColor: '#374151',
                border: '1px solid #4B5563',
                borderRadius: '4px',
                color: 'white'
              }}
            />
            {task.note && (
              <p style={{ fontSize: '0.9rem', color: '#9CA3AF', marginTop: '0.5rem' }}>
                Note: {task.note}
              </p>
            )}
          </div>
        ))}
        <button 
          onClick={handleSubmit}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6366F1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            width: '100%'
          }}
        >
          Submit Answers
        </button>
      </div>
    </div>
  );
};

export default TaskSession;