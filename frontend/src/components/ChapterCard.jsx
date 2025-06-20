// File: src/components/ChapterCard.jsx

import React from "react";
import "../styles/ChapterCard.css";

const ChapterCard = ({ title, completed, onClick }) => (
  <div className={`chapter-card ${completed ? "done" : ""}`} onClick={onClick}>
    <h3>{title}</h3>
    <p>{completed ? "✅ Completed" : "❌ Incomplete"}</p>
  </div>
);

export default ChapterCard;
