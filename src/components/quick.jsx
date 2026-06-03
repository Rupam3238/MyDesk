import React, { useState } from 'react';

const Quick = () => {
  const [items, setItems] = useState([
    { id: 1, label: 'Project Docs', icon: 'ti-file', color: 'purple' },
    { id: 2, label: 'GitHub', icon: 'ti-brand-github', color: 'blue' },
    { id: 3, label: 'Figma', icon: 'ti-brand-figma', color: 'green' },
    { id: 4, label: 'Slack', icon: 'ti-brand-slack', color: 'blue' },
    { id: 5, label: 'Notion', icon: 'ti-database', color: 'blue' },
    { id: 6, label: 'Calendar', icon: 'ti-calendar', color: 'amber' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('ti-link');

  const handleAdd = () => {
    if (newLabel.trim()) {
      const colors = ['purple', 'blue', 'green', 'amber'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setItems([...items, { id: Date.now(), label: newLabel, icon: newIcon, color: randomColor }]);
      setNewLabel('');
      setNewIcon('ti-link');
      setShowForm(false);
    }
  };

  const handleRemove = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getColorClass = (color) => {
    const colorMap = {
      purple: '#7F77DD',
      blue: '#378ADD',
      green: '#1D9E75',
      amber: '#EF9F27',
    };
    return colorMap[color] || colorMap.purple;
  };

  const iconOptions = [
    'ti-link',
    'ti-file',
    'ti-brand-github',
    'ti-brand-figma',
    'ti-brand-slack',
    'ti-database',
    'ti-calendar',
    'ti-mail',
    'ti-music',
    'ti-tool',
    'ti-settings',
    'ti-palette',
  ];

  return (
    <div className="card quick-launch-card">
      <div className="card-header">
        <div className="card-title">
          <i className="ti ti-rocket"></i>
          Quick Launch
        </div>
        <button
          className="btn btn-icon"
          onClick={() => setShowForm(!showForm)}
          title="Add new quick link"
        >
          <i className="ti ti-plus"></i>
        </button>
      </div>

      {showForm && (
        <div className="quick-form">
          <div className="quick-form-group">
            <label>Label</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g., Gmail"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>

          <div className="quick-form-group">
            <label>Icon</label>
            <div className="quick-icon-grid">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  className={`quick-icon-option ${newIcon === icon ? 'active' : ''}`}
                  onClick={() => setNewIcon(icon)}
                >
                  <i className={`ti ${icon}`}></i>
                </button>
              ))}
            </div>
          </div>

          <div className="quick-form-actions">
            <button className="btn btn-primary" onClick={handleAdd}>
              <i className="ti ti-check"></i>
              Add
            </button>
            <button className="btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="quick-grid">
        {items.map((item) => (
          <div key={item.id} className="quick-item">
            <button
              className="quick-btn"
              style={{ '--quick-color': getColorClass(item.color) }}
              onClick={() => console.log(`Launching: ${item.label}`)}
            >
              <i className={`ti ${item.icon}`}></i>
            </button>
            <div className="quick-label">{item.label}</div>
            <button
              className="quick-remove"
              onClick={() => handleRemove(item.id)}
              title="Remove"
            >
              <i className="ti ti-x"></i>
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .quick-launch-card {
          padding: 16px;
        }

        .quick-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 12px;
        }

        .quick-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding-bottom: 20px;
        }

        .quick-btn {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: var(--surface2);
          border: 0.5px solid var(--border2);
          color: var(--quick-color, #7F77DD);
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.12s;
          position: relative;
        }

        .quick-btn:hover {
          background: var(--surface3);
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(127, 119, 221, 0.2);
        }

        .quick-btn:active {
          transform: scale(0.95);
        }

        .quick-label {
          font-size: 11px;
          color: var(--text2);
          text-align: center;
          word-break: break-word;
          max-width: 60px;
          line-height: 1.2;
        }

        .quick-remove {
          position: absolute;
          bottom: 4px;
          right: -4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--red);
          border: none;
          color: white;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.12s;
        }

        .quick-item:hover .quick-remove {
          opacity: 1;
        }

        .quick-form {
          margin: 12px 0;
          padding: 12px;
          background: var(--surface2);
          border-radius: 8px;
          border: 0.5px solid var(--border2);
        }

        .quick-form-group {
          margin-bottom: 12px;
        }

        .quick-form-group:last-of-type {
          margin-bottom: 0;
        }

        .quick-form-group label {
          display: block;
          font-size: 10px;
          color: var(--text3);
          margin-bottom: 6px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .quick-form-group input {
          width: 100%;
          padding: 6px 10px;
          background: var(--surface);
          border: 0.5px solid var(--border2);
          border-radius: 6px;
          color: var(--text);
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.12s;
        }

        .quick-form-group input:focus {
          outline: none;
          border-color: var(--purple);
        }

        .quick-icon-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        .quick-icon-option {
          width: 100%;
          aspect-ratio: 1;
          border: 0.5px solid var(--border2);
          background: var(--surface);
          color: var(--text2);
          font-size: 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.12s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quick-icon-option:hover {
          border-color: var(--purple);
          color: var(--purple);
          background: var(--purple-light);
        }

        .quick-icon-option.active {
          background: var(--purple);
          color: white;
          border-color: var(--purple);
        }

        .quick-form-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .quick-form-actions .btn {
          flex: 1;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .quick-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
          }

          .quick-btn {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }

          .quick-label {
            font-size: 10px;
            max-width: 50px;
          }
        }
      `}</style>
    </div>
  );
};

export default Quick;
