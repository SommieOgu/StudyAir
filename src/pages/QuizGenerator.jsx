import React, { useState } from "react";
import "./QuizGenerator.css";

export default function QuizGenerator() {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [questions, setQuestions] = useState("");
  const [questionType, setQuestionType] = useState("multiple-choice");
  const [difficulty, setDifficulty] = useState("easy");
  const [shuffle, setShuffle] = useState(false);
  const [timeLimit, setTimeLimit] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "className":
        setClassName(value);
        break;
      case "topic":
        setTopic(value);
        break;
      case "subtopic":
        setSubtopic(value);
        break;
      case "questions":
        setQuestions(value);
        break;
      case "questionType":
        setQuestionType(value);
        break;
      case "difficulty":
        setDifficulty(value);
        break;
      case "shuffle":
        setShuffle(checked);
        break;
      case "timeLimit":
        setTimeLimit(value);
        break;
      default:
        break;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log({
      name,
      className,
      topic,
      subtopic,
      questions,
      questionType,
      difficulty,
      shuffle,
      timeLimit,
    });
    alert("Quiz Generated! Check console for submitted data.");
  }

  return (
    <div className="quiz-box">
  <h2>Quiz Generator</h2>
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
      Topic:
      <input type="text" name="topic" value={topic} onChange={handleChange} />
    </label>
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
      Shuffle:
      <input type="checkbox" name="shuffle" checked={shuffle} onChange={handleChange} />
    </label>
    <label>
      Time Limit:
      <input type="number" name="timeLimit" value={timeLimit} onChange={handleChange} />
    </label>
    <button type="submit">Generate Quiz</button>
  </div>
</div>
  );
}
