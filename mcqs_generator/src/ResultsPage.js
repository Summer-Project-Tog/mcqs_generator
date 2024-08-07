import React, { useEffect, useState } from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

import { Link, useNavigate, useLocation } from "react-router-dom";
import facebookLogo from "./assets/images/facebook_logo.png";
import twitterLogo from "./assets/images/twitter_logo.png";
import instagramLogo from "./assets/images/instagram_logo.png";
import "./ResultsPage.css";
import { db, collection, getDocs } from "./firebase.js";

function ResultsPage() {
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [mcqId, setMcqId] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { timer, answers } = location.state || { timer: 0, answers: {} };

  useEffect(() => {
    if (location.state && location.state.mcqId) {
      setMcqId(location.state.mcqId);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchCorrectAnswers = async () => {
      if (mcqId) {
        try {
          const querySnapshot = await getDocs(
            collection(db, "mcqQuestions", mcqId, "questions")
          );
          const correctAnswersObj = {};
          querySnapshot.forEach((doc) => {
            // console.log(
            //   `Fetched document: ${doc.id}, data: ${JSON.stringify(doc.data())}`
            // );
            correctAnswersObj[doc.id] = doc.data().answer;
          });
          setCorrectAnswers(correctAnswersObj);

          // console.log("Fetched Correct Answers:", correctAnswersObj);

          let correctCount = 0;
          Object.keys(answers).forEach((questionId) => {
            // console.log(`User Answer for ${questionId}:`, answers[questionId]);
            // console.log(
            //   `Correct Answer for ${questionId}:`,
            //   correctAnswersObj[questionId]
            // );

            if (answers[questionId] === correctAnswersObj[questionId]) {
              correctCount++;
            }
          });
          setScore(correctCount);
        } catch (error) {
          console.error("Error fetching correct answers:", error);
        }
      }
    };

    fetchCorrectAnswers();
  }, [mcqId, answers]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleShowAnswers = () => {
    navigate("/mcq", { state: { answers, correctAnswers, mcqId } });
  };

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
          <h1>
            {score / Object.keys(correctAnswers).length > 0.5
              ? "Congratulations!"
              : "Try harder next time!"}
          </h1>
          <div className="content-chart">
            <div className="content-results">
              <p>
                Your results: {score}/{Object.keys(correctAnswers).length} (
                {((score / Object.keys(correctAnswers).length) * 100).toFixed(
                  2
                )}
                %)
              </p>
              <p>
                Status:{" "}
                {score / Object.keys(correctAnswers).length > 0.5
                  ? "PASSED"
                  : "FAILED"}
              </p>
              <p>Time: {formatTime(timer)}</p>
            </div>
            <Gauge
              width={100}
              height={100}
              value={(
                (score / Object.keys(correctAnswers).length) *
                100
              ).toFixed(2)}
              cornerRadius="0%"
              sx={(theme) => ({
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 15,
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: "#0085FF",
                },
                [`& .${gaugeClasses.referenceArc}`]: {
                  fill: "#fe0100",
                },
              })}
            />
          </div>
        </div>
        <div className="content">
          <button onClick={handleShowAnswers} className="handle-answers-button">
            Show Answers
          </button>
          <Link to="/">
            <button className="home-button"> Go back to Home</button>
          </Link>
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

export default ResultsPage;
