import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MCQPage.css";  // Import the new CSS file
import { db, collection, getDocs } from "./firebase.js";

function MCQPage() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const questionsArray = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        questionsArray.push({
          question: data.question,
          options: data.option,
        });
      });
      setQuestions(questionsArray);
    };
    fetchQuestions();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/results");
  };

  return (
    <div className="mcq-page">
      <header className="App-header">
        <div className="nav-bar">
          <div className="logo">MCQ Gen</div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
        <div className="content">
          <h1>MCQ Quiz</h1>
          <form onSubmit={handleSubmit}>
            {questions.map((questionObj, index) => (
              <div key={index} className="question-container">
                <label className="question-text">{`Question ${index + 1}`}</label>
                <p className="question">{questionObj.question}</p>
                <div className="options-container">
                  {questionObj.options && Array.isArray(questionObj.options) ? (
                    questionObj.options.map((option, idx) => (
                      <div key={idx} className="option">
                        <input
                          type="radio"
                          name={`q${index + 1}`}
                          value={option}
                        />{" "}
                        {option}
                      </div>
                    ))
                  ) : (
                    <div>Options not available</div>
                  )}
                </div>
              </div>
            ))}
            <button type="submit">Done!</button>
          </form>
        </div>
      </header>
      <footer className="footer">
        <p>MCQ Gen</p>
        <div className="social-icons">
          <a href="#facebook" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#twitter" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#instagram" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#youtube" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
        </div>
      </footer>
    </div>
  );
}

export default MCQPage;