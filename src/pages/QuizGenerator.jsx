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
  const [quizOutput, setQuizOutput] = useState("");
  const [parsedQuiz, setParsedQuiz] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  function handleChange(e) {
    const { name, value, checked } = e.target;

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

  // ⭐ UPDATED: Better parsing function
  function parseQuiz(quizText) {
    const lines = quizText.split('\n').filter(line => line.trim());
    const parsed = [];
    let currentQuestion = null;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Match question format: Q1. Question text
      if (/^Q\d+\./.test(trimmedLine)) {
        if (currentQuestion) parsed.push(currentQuestion);
        currentQuestion = {
          question: trimmedLine.replace(/^Q\d+\.\s*/, ''),
          options: [],
          correctAnswer: ''
        };
      }
      // Match options: A. option text (handle various formats)
      else if (/^[A-D][\.\)]\s+/.test(trimmedLine) && currentQuestion) {
        const letter = trimmedLine.charAt(0);
        const text = trimmedLine.substring(2).trim(); // Get text after "A. " or "A) "
        currentQuestion.options.push({ letter, text });
      }
      // Match correct answer
      else if (/Correct Answer:/i.test(trimmedLine) && currentQuestion) {
        const match = trimmedLine.match(/[A-D]/);
        if (match) currentQuestion.correctAnswer = match[0];
      }
    });

    if (currentQuestion) parsed.push(currentQuestion);
    
    // Debug: log parsed quiz
    console.log("Parsed Quiz:", parsed);
    
    return parsed;
  }

  function handleAnswerSelect(questionIndex, selectedLetter) {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedLetter
    }));
  }

  function handleSubmitAnswers() {
    setShowResults(true);
  }

  function calculateScore() {
    let correct = 0;
    parsedQuiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const formData = new FormData();

      if (file) formData.append("file", file);
      formData.append("name", name);
      formData.append("className", className);
      formData.append("topic", topic);
      formData.append("questions", questions);
      formData.append("questionType", questionType);
      formData.append("difficulty", difficulty);
      formData.append("shuffle", shuffle);
      formData.append("timeLimit", timeLimit);

      const response = await fetch("http://localhost:3000/api/generate-quiz", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setQuizOutput(data.quiz);
      setParsedQuiz(parseQuiz(data.quiz));
      setSelectedAnswers({});
      setShowResults(false);

    } catch (err) {
      console.error("Quiz generation error:", err);
      alert("Error generating quiz.");
    }
  }

  return (
    <div className="quiz-page">
      <h2>Quiz Generator</h2>
      <form className="quiz-box" onSubmit={handleSubmit}>
        <div className="quiz-columns">
          <div className="quiz-column">
            <label>Name:
              <input type="text" name="name" value={name} onChange={handleChange} />
            </label>
            <label>Class:
              <input type="text" name="className" value={className} onChange={handleChange} />
            </label>
            <label>Topic (optional):
              <input type="text" name="topic" value={topic} onChange={handleChange} />
            </label>
            <label>Upload notes:
              <input type="file" accept=".pdf,.docx,.pptx,.txt" onChange={handleFileChange} />
            </label>
            {file && <p>Selected file: {file.name}</p>}
          </div>

          <div className="quiz-column">
            <label>Number of Questions:
              <input type="number" name="questions" value={questions} onChange={handleChange} />
            </label>
            <label>Question Type:
              <select name="questionType" value={questionType} onChange={handleChange}>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True / False</option>
                <option value="short-answer">Short Answer</option>
              </select>
            </label>
            <label>Difficulty:
              <select name="difficulty" value={difficulty} onChange={handleChange}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <label>Shuffle Questions:
              <input type="checkbox" name="shuffle" checked={shuffle} onChange={handleChange} />
            </label>
          </div>
        </div>

        <div className="quiz-row">
          <div className="quiz-column">
            <label>Time Limit (minutes):
              <input type="number" name="timeLimit" value={timeLimit} onChange={handleChange} />
            </label>
          </div>

          <div className="quiz-column" style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit">Generate Quiz</button>
          </div>
        </div>
      </form>

      {/* INTERACTIVE QUIZ */}
      {parsedQuiz.length > 0 ? (
        <div className="quiz-result">
          <h2>{name}'s Quiz - {className}</h2>
          
          {parsedQuiz.map((q, qIndex) => (
            <div key={qIndex} className="question-block">
              <h3>Q{qIndex + 1}. {q.question}</h3>
              
              <div className="options-container">
                {q.options.map((option) => {
                  const isSelected = selectedAnswers[qIndex] === option.letter;
                  const isCorrect = option.letter === q.correctAnswer;
                  
                  let buttonClass = "option-button";
                  if (showResults) {
                    if (isCorrect) buttonClass += " correct";
                    else if (isSelected && !isCorrect) buttonClass += " incorrect";
                  } else if (isSelected) {
                    buttonClass += " selected";
                  }

                  return (
                    <button
                      key={option.letter}
                      onClick={() => !showResults && handleAnswerSelect(qIndex, option.letter)}
                      disabled={showResults}
                      className={buttonClass}
                    >
                      <strong>{option.letter}.</strong> {option.text}
                      {showResults && isCorrect && " ✓"}
                      {showResults && isSelected && !isCorrect && " ✗"}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!showResults ? (
            <button onClick={handleSubmitAnswers} className="submit-button">
              Submit Answers
            </button>
          ) : (
            <div className="score-display">
              <h3>Your Score: {calculateScore()} / {parsedQuiz.length}</h3>
              <p>{((calculateScore() / parsedQuiz.length) * 100).toFixed(0)}%</p>
            </div>
          )}
        </div>
      ) : quizOutput ? (
        // FALLBACK: Show raw text if parsing failed
        <div className="quiz-result">
          <h2>Generated Quiz</h2>
          <pre className="quiz-text">{quizOutput}</pre>
        </div>
      ) : null}
    </div>
  );
}