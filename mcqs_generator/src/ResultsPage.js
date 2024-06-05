import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import facebookLogo from './assets/images/facebook_logo.png';
import twitterLogo from './assets/images/twitter_logo.png';
import instagramLogo from './assets/images/instagram_logo.png';
import './ResultsPage.css';

function ResultsPage() {
  const navigate = useNavigate();

  return (
    <div className="ResultsPage">
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
      <footer className="App-footer">
        <p>MCQ Gen</p>
        <div className="social-icons">
          <a href="#facebook"><img src={facebookLogo} alt="Facebook" className="social-media-logo" /></a>
          <a href="#twitter"><img src={twitterLogo} alt="Twitter" className="social-media-logo" /></a>
          <a href="#instagram"><img src={instagramLogo} alt="Instagram" className="social-media-logo" /></a>
        </div>
      </footer>
    </div>
  );
}

export default ResultsPage;