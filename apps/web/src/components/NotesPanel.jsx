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

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="ti ti-notes"></i>Quick Notes</div>
        <div className="btn-row">
          <button className="btn btn-ghost btn-icon"><i className="ti ti-search"></i></button>
          <button className="btn" onClick={handleAdd}><i className="ti ti-plus"></i> Add</button>
        </div>
      </div>
      <div className="notes-body">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option>All</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Capture a thought..." />
          <button className="btn" onClick={handleAdd}><i className="ti ti-plus"></i> Add</button>
        </div>

        {(notes || []).filter(n => !selectedCategory || selectedCategory === 'All' || n.category === selectedCategory).map(note => (
          <div key={note.id} className="n-card">
            <i className={`ti ti-pin n-pin`} style={{ color: `var(--${note.color || 'purple'})` }}></i>
            <div>
              <div className="n-text">{note.content || note.text}</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{note.category}</div>
              {(note.tags || []).length > 0 && (
                <div className="n-tags">
                  {(note.tags || []).map(tag => (
                    <span key={tag} className="n-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
