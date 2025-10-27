import React, { useState } from "react";
import "./ExamPrep.css";
// asked chat for help to create the flashcard system
function ExamPrep() {
  const [flashcards, setFlashcards] = useState([]); // Array of flashcards
  const [questionInput, setQuestionInput] = useState(""); // Manual question input
  const [answerInput, setAnswerInput] = useState(""); // Optional answer input
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the current flashcard
  const [showAnswer, setShowAnswer] = useState(false); // Toggle between question and answer

  // Add a new manual flashcard
  const addFlashcard = () => {
    if (!questionInput) return; // Do not add if question is empty
    setFlashcards([
      ...flashcards,
      { question: questionInput, answer: answerInput } // Add new flashcard
    ]);
    setQuestionInput("");
    setAnswerInput("");
  };

  // Delete a flashcard
  const deleteFlashcard = (index) => {
    setFlashcards(flashcards.filter((_, i) => i !== index)); // remove flashcard at index
    if (currentIndex >= flashcards.length - 1) { 
      setCurrentIndex(Math.max(0, flashcards.length - 2)); 
    }
  };

  // Navigate flashcards
  const nextCard = () => setCurrentIndex((prev) => (prev + 1) % flashcards.length);  // go to next card
  const prevCard = () => setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);  // go to previous card

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // get the uploaded file
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result; 
      const newCards = text 
        .split("\n") 
        .map(line => line.trim()) // trim whitespace
        .filter(line => line !== "") // remove empty lines
        .map(line => ({ question: line, answer: "" })); // create flashcard objects
      setFlashcards(prev => [...prev, ...newCards]); // append new flashcards
    };
    reader.readAsText(file);
  };

  const currentCard = flashcards[currentIndex]; // get the current flashcard

  return (
    <div className="exam-prep-container">
      <h2>Exam Prep</h2>

      <div className="manual-flashcard">
        <h3>Create Flashcard</h3>
        <input
          type="text"
          placeholder="Question"
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Answer (optional)"
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
        />
        <button onClick={addFlashcard}>Add Flashcard</button>
      </div>

      <div className="flashcard-upload">
        <label htmlFor="note-upload">Upload Notes to Generate Flashcards:</label>
        <input type="file" id="note-upload" accept=".txt" onChange={handleFileUpload} />
      </div>

    
      {flashcards.length > 0 ? (  
        <div className="flashcard-deck"> 
          <div className="flashcard">
            <p>{showAnswer ? currentCard.answer || "Answer not filled yet" : currentCard.question}</p> 
          </div>
          <div className="deck-controls">
            <button onClick={prevCard}>Previous</button>
            <button onClick={() => setShowAnswer(!showAnswer)}>
              {showAnswer ? "Show Question" : "Show Answer"}
            </button>
            <button onClick={nextCard}>Next</button>
            <button onClick={() => deleteFlashcard(currentIndex)}>Delete</button>
          </div>
          <p>{currentIndex + 1} / {flashcards.length}</p>
        </div>
      ) : (
        <p>No flashcards yet. Add or upload some to get started!</p>
      )}
    </div>
  );
}

export default ExamPrep;
