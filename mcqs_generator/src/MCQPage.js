import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import facebookLogo from './assets/images/facebook_logo.png';
import twitterLogo from './assets/images/twitter_logo.png';
import instagramLogo from './assets/images/instagram_logo.png';
import "./MCQPage.css";  // Import the new CSS file
import { db, collection, getDocs } from "./firebase.js";

function MCQPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const questionsArray = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        questionsArray.push({
          id: doc.id, // Use document ID
          question: data.question,
          options: data.option,
        });
      });
      setQuestions(questionsArray);
    };
    fetchQuestions();

    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex, // Use questionId instead of index
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/results", { state: { timer, answers } });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
          <div className="timer">Time Elapsed: {formatTime(timer)}</div>
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
                          name={`q${questionObj.id}`} // Use questionId as name
                          value={idx}
                          onChange={() => handleOptionChange(questionObj.id, idx)}
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
      <footer className="App-footer">
        <p>MCQ Gen</p>
        <div className="social-icons">
          <a href="#facebook"><img src={facebookLogo} alt="Facebook" className="social-media-logo"/></a>
          <a href="#twitter"><img src={twitterLogo} alt="Twitter" className="social-media-logo"/></a>
          <a href="#instagram"><img src={instagramLogo} alt="Instagram" className="social-media-logo"/></a>
        </div>
      </footer>
    </div>
  );
}

export default MCQPage;