export default function NotesPanel({ notes, onAddNote }) {
  const handleAddClick = () => {
    const text = prompt('Capture a thought:')
    if (text) onAddNote(text)
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="ti ti-notes"></i>Quick Notes</div>
        <div className="btn-row">
          <button className="btn btn-ghost btn-icon"><i className="ti ti-search"></i></button>
          <button className="btn" onClick={handleAddClick}><i className="ti ti-plus"></i> Add</button>
        </div>
      </div>
      <div className="notes-body">
        {notes.map(note => (
          <div key={note.id} className="n-card">
            <i className={`ti ti-pin n-pin`} style={{ color: `var(--${note.color})` }}></i>
            <div>
              <div className="n-text">{note.text}</div>
              {note.tags.length > 0 && (
                <div className="n-tags">
                  {note.tags.map(tag => (
                    <span key={tag} className="n-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="n-add" onClick={handleAddClick}>
          <i className="ti ti-plus"></i>Capture a thought...
        </div>
      </div>
    </div>
  )
}
