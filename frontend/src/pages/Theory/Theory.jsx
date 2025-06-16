import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Theory.css";

const Theory = () => {
  const navigate = useNavigate();
  const [expandedTopics, setExpandedTopics] = useState({});

  const handleToggle = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const handleChapterClick = (chapterId) => {
    navigate(`/chapter/${chapterId}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const topics = [
    {
      id: "topic1",
      title: "Network Scanning",
      chapters: [
        { id: "chapter1", title: "Nmap Basics" },
        { id: "chapter2", title: "Port Scanning Techniques" },
      ],
    },
    {
      id: "topic2",
      title: "Exploitation",
      chapters: [
        { id: "chapter3", title: "Buffer Overflows" },
        { id: "chapter4", title: "Metasploit Modules" },
      ],
    },
    {
      id: "topic3",
      title: "Post Exploitation",
      chapters: [
        { id: "chapter5", title: "Persistence" },
        { id: "chapter6", title: "Privilege Escalation" },
      ],
    },
  ];

  return (
    <div className="theory-container">
      <h2>Theory Overview</h2>
      {topics.map((topic) => (
        <div key={topic.id} className="topic-section">
          <button className="topic-button" onClick={() => handleToggle(topic.id)}>
            {topic.title}
          </button>
          {expandedTopics[topic.id] && (
            <ul className="chapter-list">
              {topic.chapters.map((chapter) => (
                <li key={chapter.id}>
                  <button onClick={() => handleChapterClick(chapter.id)}>
                    {chapter.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Theory;
