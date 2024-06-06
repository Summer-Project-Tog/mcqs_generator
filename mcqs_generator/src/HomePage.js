import React, { useRef, useState } from "react";
import facebookLogo from "./assets/images/facebook_logo.png";
import twitterLogo from "./assets/images/twitter_logo.png";
import instagramLogo from "./assets/images/instagram_logo.png";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

function HomePage() {
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL_POST_TEXT;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      text: text,
    };
    try {
      // Add the backend URL later!!!
      const response = await fetch(
        backendUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        console.log("Data submitted successfully");
        navigate("/mcq");
      } else {
        console.error("Failed to submit data");
        alert("Failed to submit data");
        // Delete this later!!! when API is decided
        navigate("/mcq");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Add the backend URL later!!!
      const response = await fetch("backend URL", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("File uploaded successfully");
        navigate("/mcq");
      } else {
        console.error("Failed to upload file");
        alert("Failed to upload file");
        // Delete this later!!! when API is decided
        navigate("/mcq");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    }
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
          <h1>Start studying today!</h1>
          <p>
            Practice with questions curated by our own specialized LLM AI, built
            from Llama3
          </p>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Enter your text here ..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
          <p className="OR-logo">OR</p>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button onClick={handleButtonClick} className="import-button">
            Import a PDF text
          </button>
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

export default HomePage;
