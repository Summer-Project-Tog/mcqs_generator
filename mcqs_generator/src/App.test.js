import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders start studying today text', () => {
  render(
    <Router>
      <App />
    </Router>
  );
  const textElement = screen.getByText(/start studying today/i);
  expect(textElement).toBeInTheDocument();
});