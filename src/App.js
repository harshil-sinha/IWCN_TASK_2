import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/notes')
      .then(response => setNotes(response.data))
      .catch(error => console.error('Error fetching notes:', error));
  }, []);

  const handleAddNote = () => {
    axios.post('http://localhost:5000/api/notes', newNote)
      .then(response => {
        setNotes([...notes, response.data]);
        setNewNote({ title: '', content: '' });
      })
      .catch(error => console.error('Error adding note:', error));
  };

  const handleDeleteNote = id => {
    axios.delete(`http://localhost:5000/api/notes/${id}`)
      .then(() => {
        setNotes(notes.filter(note => note.id !== id));
      })
      .catch(error => console.error('Error deleting note:', error));
  };

  return (
    <>
      <div className='container'>
        <div className='main'>
          <h1>Notes App</h1>
        </div>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={e => setNewNote({ ...newNote, title: e.target.value })}
          />
          <textarea
            placeholder="Content"
            value={newNote.content}
            onChange={e => setNewNote({ ...newNote, content: e.target.value })}
          />
          <button onClick={handleAddNote}><FontAwesomeIcon icon={faPlus} /></button>
        </div>
        <ul>
          {notes.map(note => (
            <li key={note.id}>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
              <button onClick={() => handleDeleteNote(note.id)}><FontAwesomeIcon icon={faTrash} /></button>
            </li>
          ))}
        </ul>
        <div className='footer'>
          <p>Made with <span style={{ color: "red", padding: "3px" }}><FontAwesomeIcon icon={faHeart} /></span> Harshil</p>
        </div>
      </div>
    </>
  );
}

export default App;
