import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function HomePage() {
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
          <h1>Start studying today!</h1>
          <p>Practice with questions curated by our own specialized LLM AI, built from Llama3</p>
          <textarea placeholder="Enter your text here ..."></textarea>
          <Link to="/mcq">
            <button className="submit-button">Submit</button>
          </Link>
          <p>OR</p>
          <button className="import-button">Import a PDF text</button>
        </div>
      </header>
      <footer className="App-footer">
        <p>MCQ Gen</p>
        <div className="social-icons">
          <a href="#facebook">Facebook</a>
          <a href="#twitter">Twitter</a>
          <a href="#instagram">Instagram</a>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;