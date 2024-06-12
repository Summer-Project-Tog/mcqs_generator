import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import './App.css';
import HomePage from './HomePage';
import MCQPage from './MCQPage';
import ResultsPage from './ResultsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mcq" element={<MCQPage />} />
          <Route path="/results" element={
            <StyledEngineProvider injectFirst>
              <ResultsPage />
            </StyledEngineProvider>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;