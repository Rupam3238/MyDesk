import { useState } from 'react'
import { CATEGORIES } from '../../utils/constants.js'

// props: notes, onAddNote, onDeleteNote

export default function NotesPanel({ notes, onAddNote, onDeleteNote }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [input, setInput] = useState('')
  const [deleteCandidate, setDeleteCandidate] = useState(null)

  const handleAdd = () => {
    const text = input.trim()
    if (!text) return
    onAddNote(text, selectedCategory === 'All' ? null : selectedCategory)
    setInput('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  const filteredNotes = (notes || []).filter(
    n => !selectedCategory || selectedCategory === 'All' || n.category === selectedCategory
  )

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <i className="ti ti-notes"></i>
          <select className="notes-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <option>All</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
          </select>
          Notes
        </div>
        
      </div>
      <div className="notes-body">
        

        {/* Notes List */}
        <div className="notes-list">
            {filteredNotes.length === 0 ? (
            <div className="notes-empty">
              <i className="ti ti-inbox"></i>
              <div>No notes yet</div>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div key={note.id} className="n-card">
                <div className="n-pin-wrapper">
                  <i className={`ti ti-pin n-pin`} style={{ color: `var(--${note.color || 'purple'})` }}></i>
                </div>
                <div className="n-content">
                  <div className="n-text">{note.content || note.text}</div>
                  {note.category && (
                    <div className="n-category">{note.category}</div>
                  )}
                  {(note.tags || []).length > 0 && (
                    <div className="n-tags">
                      {(note.tags || []).map(tag => (
                        <span key={tag} className="n-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="n-delete"
                  title="Delete note"
                  onClick={() => setDeleteCandidate(note.id)}
                >
                  <i className="ti ti-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Input Controls */}
        <div className="notes-controls">
          <div className="input-group">
            
            <input
              className="notes-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What's on your mind..."
            />
          </div>
        </div>


        {deleteCandidate && (
          <div className="delete-confirm">
            <div>Delete this note?</div>
            <div className="delete-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteCandidate(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={async () => {
                if (typeof onDeleteNote === 'function') await onDeleteNote(deleteCandidate)
                setDeleteCandidate(null)
              }}>Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
