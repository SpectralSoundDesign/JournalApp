import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Journal = () => {
  const { id: journalId } = useParams();
  const [entries, setEntries] = useState([]);
  const [newEntryText, setNewEntryText] = useState('');
  const [journalName, setJournalName] = useState('');

  useEffect(() => {
    fetch(`/journals/${journalId}/entries`)
      .then(response => response.json())
      .then(data => {
        setEntries(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    fetch(`/journals/${journalId}`)
      .then(response => response.json())
      .then(data => {
        setJournalName(data.name);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [journalId]); // Include journalId in the dependency array

  const addEntry = () => {
    const newEntry = { id: entries.length + 1, text: newEntryText };
    setEntries([...entries, newEntry]);

    fetch(`/journals/${journalId}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newEntry.id,
        text: newEntry.text,
        created_at: new Date().toISOString(),
      }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => {
        console.error('Error:', error);
      });

    setNewEntryText(''); // Clear the input field after adding the entry
  };

  const deleteEntry = (entryId) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    setEntries(updatedEntries);

    fetch(`/journals/${journalId}/entries/${entryId}`, {
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
      <h1 className="mt-3">{journalName}</h1>
      <form onSubmit={addEntry} className="mb-3">
        <div className="input-group">
          <textarea
            onChange={(e) => setNewEntryText(e.target.value)}
            className="form-control form-control-lg" // Update className to include form-control-lg
            placeholder="Enter new entry"
          />
          <button type="submit" className="btn btn-success">Add Entry</button>
        </div>
      </form>
      {entries.map(entry => (
        <div key={entry.id} className="card mb-3">
          <div className="card-body">
            <p className="card-text">{entry.text}</p>
            <p className="card-text"><small className="text-muted">Created at: {entry.created_at}</small></p>
            <button onClick={() => deleteEntry(entry.id)} className="btn btn-danger">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Journal;