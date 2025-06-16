import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/Chapter.css";

const chapterData = {
  chapter1: {
    title: "Nmap Basics",
    content: (
      <>
        <p>
          Nmap is a powerful network scanning tool used to discover hosts and
          services on a computer network.
        </p>
        <p>
          It works by sending packets and analyzing the responses. You can
          perform various scans like TCP, SYN, and UDP.
        </p>
        <pre>
{`Example:
nmap -sS 192.168.1.1
nmap -sU 192.168.1.1`}
        </pre>
      </>
    ),
  },
  chapter2: {
    title: "Port Scanning Techniques",
    content: "Common techniques include TCP connect scan, SYN scan, UDP scan. Each has pros/cons regarding stealth and accuracy.",
  },
  chapter3: {
    title: "Buffer Overflows",
    content: "Buffer overflows occur when data exceeds buffer capacity, potentially allowing code execution or crashes.",
  },
  // Add more chapters here as needed
};

const Chapter = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const chapter = chapterData[chapterId];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  if (!chapter) {
    return <div className="chapter-container">Chapter not found.</div>;
  }

  const handleStartTask = () => {
    navigate(`/task/${chapterId}`);
  };

  return (
    <div className="chapter-container">
      <h2>{chapter.title}</h2>
      <p>{chapter.content}</p>
      <button className="start-task-button" onClick={handleStartTask}>Start Task</button>
    </div>
  );
};

export default Chapter;
