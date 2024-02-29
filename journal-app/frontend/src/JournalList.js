import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const JournalList = () => {
  const [journals, setJournals] = useState([]);
  const [newJournalName, setNewJournalName] = useState('');
  const [newJournalDescription, setNewJournalDescription] = useState('');

  useEffect(() => {
    fetch('/journals', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setJournals(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const addJournal = () => {
    const newJournal = { id: journals.length + 1, name: newJournalName, description: newJournalDescription };
    setJournals([...journals, newJournal]);

    fetch(`/journals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newJournal.id,
        name: newJournal.name,
        description: newJournal.description,
        created_at: new Date().toISOString(),
      }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });

    setNewJournalName('');
    setNewJournalDescription('');
  };

  const deleteJournal = (id) => {
    const updatedJournals = journals.filter(journal => journal.id !== id);
    setJournals(updatedJournals);

    fetch(`/journals/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="container">
      <form className="mt-3">
        <div className="row">
          <div className="col-md-4" style={{ marginTop: "3px" }}>
            <input
              type="text"
              className="form-control"
              value={newJournalName}
              onChange={e => setNewJournalName(e.target.value)}
              placeholder="Enter journal name"
            />
          </div>
          <div className="col-md-4" style={{ marginTop: "3px" }}>
            <textarea
              className="form-control"
              value={newJournalDescription}
              onChange={e => setNewJournalDescription(e.target.value)}
              placeholder="Enter journal description"
            />
          </div>
          <div className="col-md-4" style={{ marginTop: "5px" }}>
            <button type="button" className="btn btn-success" onClick={addJournal}>Add Journal</button>
          </div>
        </div>
      </form>
      <div className="row" style={{ marginTop: "20px" }}>
        {journals.map(journal => (
          <div className="col-md-6" key={journal.id}>
            <div className="card mb-3" style={{ backgroundColor: "lightgray" }}>
              <div className="card-body">
                <Link to={`/journals/${journal.id}`} className="card-title" style={{ textDecoration: "none" }}>
                  <h3>{journal.name}</h3>
                </Link>
                <p className="card-text">{journal.description}</p>
                <p className="card-text"><small className="text-muted">Created at: {journal.created_at}</small></p>
                <button type="button" className="btn btn-danger" onClick={() => deleteJournal(journal.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default JournalList;