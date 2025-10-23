import React, { useState } from "react";
import "./QuizGenerator.css";

export default function QuizGenerator() {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState("");
  const [questionType, setQuestionType] = useState("multiple-choice");
  const [difficulty, setDifficulty] = useState("easy");
  const [shuffle, setShuffle] = useState(false);
  const [timeLimit, setTimeLimit] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (name === "name") setName(value);
    else if (name === "className") setClassName(value);
    else if (name === "topic") setTopic(value);
    else if (name === "questions") setQuestions(value);
    else if (name === "questionType") setQuestionType(value);
    else if (name === "difficulty") setDifficulty(value);
    else if (name === "shuffle") setShuffle(checked);
    else if (name === "timeLimit") setTimeLimit(value);
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Class:", className);
    console.log("Topic:", topic);
    if (file) console.log("Uploaded file:", file.name);
    console.log("Number of questions:", questions);
    console.log("Question type:", questionType);
    console.log("Difficulty:", difficulty);
    console.log("Shuffle:", shuffle);
    console.log("Time limit:", timeLimit);

  }

  return (
    <div className="quiz-page">
      <h2>Quiz Generator</h2>
      <form className="quiz-box" onSubmit={handleSubmit}>
        <div className="quiz-columns">
          <div className="quiz-column">
            <label>
              Name:
              <input type="text" name="name" value={name} onChange={handleChange} />
            </label>
            <label>
              Class:
              <input type="text" name="className" value={className} onChange={handleChange} />
            </label>
            <label>
              Topic (optional):
              <input type="text" name="topic" value={topic} onChange={handleChange} />
            </label>
            <label>
              Upload notes or slides (optional):
              <input
                type="file"
                accept=".pdf,.docx,.pptx,.txt"
                onChange={handleFileChange}
              />
            </label>
            {file && <p>Selected file: {file.name}</p>}
          </div>


          <div className="quiz-column">
            <label>
              Number of Questions:
              <input type="number" name="questions" value={questions} onChange={handleChange} />
            </label>
            <label>
              Question Type:
              <select name="questionType" value={questionType} onChange={handleChange}>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True / False</option>
                <option value="short-answer">Short Answer</option>
              </select>
            </label>
            <label>
              Difficulty:
              <select name="difficulty" value={difficulty} onChange={handleChange}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <label>
              Shuffle Questions:
              <input type="checkbox" name="shuffle" checked={shuffle} onChange={handleChange} />
            </label>
          </div>
        </div>


        <div className="quiz-row">
          <div className="quiz-column">
            <label>
              Time Limit (minutes):
              <input
                type="number"
                name="timeLimit"
                value={timeLimit}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="quiz-column" style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit">Generate Quiz</button>
          </div>
        </div>
      </form>
    </div>
  );
}
