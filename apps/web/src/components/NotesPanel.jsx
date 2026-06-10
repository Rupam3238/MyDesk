import { useState } from 'react'
import { categories } from '../../../../packages/src/categories'

export default function NotesPanel({ notes, onAddNote }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [input, setInput] = useState('')

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
        <div className="card-title"><i className="ti ti-notes"></i>Quick Notes</div>
        <div className="btn-row">
          <button className="btn btn-ghost btn-icon"><i className="ti ti-search"></i></button>
        </div>
      </div>
      <div className="notes-body">
        {/* Input Controls */}
        <div className="notes-controls">
          <div className="input-group">
            <select className="notes-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <option>All</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              className="notes-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What's on your mind..."
            />
            <button className="btn-add-note" onClick={handleAdd} title="Add note (Enter)">
              <i className="ti ti-plus"></i>
            </button>
          </div>
        </div>

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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
