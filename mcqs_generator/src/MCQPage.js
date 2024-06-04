import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function MCQPage() {
  const navigate = useNavigate();
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
            <div>
              <label>Question 1: What is the color of apple?</label>
              <input type="radio" name="q1" value="Red" /> Red
              <input type="radio" name="q1" value="Blue" /> Blue
              <input type="radio" name="q1" value="Green" /> Green
              <input type="radio" name="q1" value="Yellow" /> Yellow
            </div>
            <div>
              <label>Question 2: What is the color of apple?</label>
              <input type="radio" name="q2" value="Red" /> Red
              <input type="radio" name="q2" value="Blue" /> Blue
              <input type="radio" name="q2" value="Green" /> Green
              <input type="radio" name="q2" value="Yellow" /> Yellow
            </div>
            <div>
              <label>Question 3: What is the color of apple?</label>
              <input type="radio" name="q3" value="Red" /> Red
              <input type="radio" name="q3" value="Blue" /> Blue
              <input type="radio" name="q3" value="Green" /> Green
              <input type="radio" name="q3" value="Yellow" /> Yellow
            </div>
            <div>
              <label>Question 4: What is the color of apple?</label>
              <input type="radio" name="q4" value="Red" /> Red
              <input type="radio" name="q4" value="Blue" /> Blue
              <input type="radio" name="q4" value="Green" /> Green
              <input type="radio" name="q4" value="Yellow" /> Yellow
            </div>
            <button type="submit">Done!</button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default MCQPage;