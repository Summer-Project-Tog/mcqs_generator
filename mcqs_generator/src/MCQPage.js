import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import { db, collection, getDocs } from './firebase';

function MCQPage() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const questionsArray = [];
      querySnapshot.forEach((doc) => {
        questionsArray.push(doc.data());
      });
      setQuestions(questionsArray);
    };
    fetchQuestions();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/results');
  };

  return (
    <div className="App">
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
            {questions.map((question, index) => (
              <div key={index}>
                <label>{`Question ${index + 1}: ${question.question}`}</label>
                {question.options.map((option, idx) => (
                  <div key={idx}>
                    <input type="radio" name={`q${index + 1}`} value={option} /> {option}
                  </div>
                ))}
              </div>
            ))}
            <button type="submit">Done!</button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default MCQPage;