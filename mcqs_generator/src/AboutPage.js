import React from "react";
import facebookLogo from "./assets/images/facebook_logo.png";
import twitterLogo from "./assets/images/twitter_logo.png";
import instagramLogo from "./assets/images/instagram_logo.png";
import {Link } from "react-router-dom";
import "./App.css";

function AboutPage() {
  
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
        
      </header>
      <footer className="App-footer">
        <p>MCQ Gen</p>
        <div className="social-icons">
          <a href="#facebook">
            <img
              src={facebookLogo}
              alt="Facebook"
              className="social-media-logo"
            />
          </a>
          <a href="#twitter">
            <img
              src={twitterLogo}
              alt="Twitter"
              className="social-media-logo"
            />
          </a>
          <a href="#instagram">
            <img
              src={instagramLogo}
              alt="Instagram"
              className="social-media-logo"
            />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;
