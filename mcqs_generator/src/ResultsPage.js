import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function ResultsPage() {
  const navigate = useNavigate();

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
          <h1>Congratulations!</h1>
          <p>Your results: 4/4 (100%)</p>
          <p>Status: PASSED</p>
          <p>Time: 01:30</p>
          <button onClick={() => navigate('/mcq')}>Show Answers</button>
          <Link to="/">Go back to Home</Link>
        </div>
      </header>
    </div>
  );
}

export default ResultsPage;