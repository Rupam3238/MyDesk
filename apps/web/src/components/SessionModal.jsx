import { useState } from 'react';
import '../styles/SessionModal.css';

export default function SessionModal({ onSessionCreate, isOpen, onClose }) {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('Study');
  const [goal, setGoal] = useState('');
  const [durationPreset, setDurationPreset] = useState(null);
  const [customMinutes, setCustomMinutes] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Study', 'Coding', 'Chess', 'Flute', 'Reading', 'Break'];
  
  const presets = [
    { label: '25m', seconds: 25 * 60 },
    { label: '50m', seconds: 50 * 60 },
    { label: '90m', seconds: 90 * 60 },
    { label: '2h', seconds: 2 * 60 * 60 },
  ];

  const getDurationInSeconds = () => {
    if (durationPreset !== null) {
      return presets[durationPreset].seconds;
    }
    if (customMinutes && !isNaN(customMinutes) && customMinutes > 0) {
      return parseInt(customMinutes) * 60;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!topic.trim()) {
      setError('Topic is required');
      return;
    }

    if (!category) {
      setError('Category is required');
      return;
    }

    const duration = getDurationInSeconds();
    if (!duration) {
      setError('Please select or enter a duration');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          category,
          goal: goal.trim() || null,
          planned_duration: duration,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const session = await response.json();
      
      // Reset form
      setTopic('');
      setGoal('');
      setDurationPreset(null);
      setCustomMinutes('');
      setShowCustom(false);

      // Notify parent
      onSessionCreate(session);
    } catch (err) {
      setError(err.message || 'Failed to create session');
      console.error('Error creating session:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="session-modal-overlay">
      <div className="session-modal">
        <div className="session-modal-header">
        <button
            type="button"
            className="modal-close"
            onClick={onClose}
        >
            <i className="ti ti-x"></i>
        </button>

        <h2>Start a Study Session</h2>
        <p>Focus on what matters</p>
        </div>

        
        <form onSubmit={handleSubmit} className="session-modal-form" autoComplete='off'>
          {/* Topic */}
          <div className="form-group">
            <label htmlFor="topic">
              What are you studying? <span className="required">*</span>
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Math, Chess Openings"
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
              disabled={loading}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Goal */}
          <div className="form-group">
            <label htmlFor="goal">
              Goal <span className="optional">(optional)</span>
            </label>
            <input
              id="goal"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Finish review of electrostatics chapter"
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* Duration - Presets */}
          <div className="form-group">
            <label>
              Commit Time <span className="required">*</span>
            </label>
            <div className="preset-grid">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`preset-btn ${durationPreset === idx ? 'active' : ''}`}
                  onClick={() => {
                    setDurationPreset(idx);
                    setShowCustom(false);
                    setCustomMinutes('');
                  }}
                  disabled={loading}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration - Custom */}
          <div className="form-group">
            <button
              type="button"
              className={`custom-toggle ${showCustom ? 'active' : ''}`}
              onClick={() => {
                setShowCustom(!showCustom);
                if (!showCustom) setDurationPreset(null);
              }}
              disabled={loading}
            >
              <i className="ti ti-plus"></i>
              Custom Duration
            </button>

            {showCustom && (
              <div className="custom-input-wrapper">
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={customMinutes}
                  onChange={(e) => {
                    setCustomMinutes(e.target.value);
                    setDurationPreset(null);
                  }}
                  placeholder="Enter minutes (1-480)"
                  className="form-input custom-input"
                  disabled={loading}
                />
                <span className="input-hint">minutes</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="form-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="ti ti-loader-2"></i>
                Creating...
              </>
            ) : (
              <>
                <i className="ti ti-player-play"></i>
                Start Session
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}