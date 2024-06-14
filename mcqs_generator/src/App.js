import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import './App.css';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage'
import MCQPage from './MCQPage';
import ResultsPage from './ResultsPage';
import { LoadingProvider, useLoading } from './LoadingContext'; // Import LoadingProvider and useLoading
import LoadingScreen from './LoadingScreen'; // Import LoadingScreen

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

function AppContent() {
  const { loading } = useLoading(); // Get loading state from context

  return (
    <Router>
      <div className="App">
        {loading && <LoadingScreen />} {/* Conditionally render LoadingScreen */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
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