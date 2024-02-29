import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import JournalList from "./JournalList";
import Journal from "./Journal";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="dark-navbar"> {/* Add a class name for styling */}
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="/" style={{ paddingLeft: '5px' }}>Home</a>
        <a className="navbar-brand" href="/journals" style={{ paddingLeft: '5px' }}>Journals</a>
      </nav>

      {/* Router */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Connect to {/* Add a class name for styling */}
          <Route path="/journals" element={<JournalList />} />
          <Route path="/journals/:id" element={<Journal />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;