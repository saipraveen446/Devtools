import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../services/api';
import { toolPageOuter, toolPageTitle } from '../styles/toolPageLayout';

const CronGenerator = () => {
  const [cronParts, setCronParts] = useState(['0', '0', '1', '*', '*']);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const cursorPos = useRef(0);

  const presets = [
    { label: 'Every minute', expression: '* * * * *' },
    { label: 'Every 5 minutes', expression: '*/5 * * * *' },
    { label: 'Hourly', expression: '0 * * * *' },
    { label: 'Daily 2 PM', expression: '0 14 * * *' },
    { label: 'Every Saturday', expression: '0 0 * * 6' },
    { label: 'Every month', expression: '0 0 1 * *' }
  ];

  const interpretCron = (parts) => {
    const [minute, hour, day, month, weekday] = parts.map(p => p || '*');
    
    let interpretation = 'This expression will run';
    
    if (minute === '*') {
      interpretation += ' every minute';
    } else if (minute.includes('*/')) {
      const interval = minute.replace('*/', '');
      interpretation += ` every ${interval} minutes`;
    } else {
      interpretation += ` at minute ${minute}`;
    }
    
    if (hour !== '*') {
      if (hour.includes('*/')) {
        const interval = hour.replace('*/', '');
        interpretation += `, every ${interval} hours`;
      } else {
        const hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum > 12 ? hourNum - 12 : (hourNum === 0 ? 12 : hourNum);
        interpretation += `, at ${hour.padStart(2, '0')}:00 (${displayHour}:00 ${ampm})`;
      }
    }
    
    if (day !== '*') {
      if (day.includes('*/')) {
        const interval = day.replace('*/', '');
        interpretation += `, every ${interval} days`;
      } else {
        interpretation += `, on day ${day} of the month`;
      }
    }

    if (month !== '*') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (month.includes('-')) {
        const [start, end] = month.split('-');
        interpretation += `, from ${monthNames[parseInt(start)-1]} to ${monthNames[parseInt(end)-1]}`;
      } else if (month.includes(',')) {
        const months = month.split(',').map(m => monthNames[parseInt(m)-1]).join(', ');
        interpretation += `, in ${months}`;
      } else {
        interpretation += `, in ${monthNames[parseInt(month)-1]}`;
      }
    }
    
    if (weekday !== '*') {
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (weekday === '1-5') {
        interpretation += ', on weekdays (Mon-Fri)';
      } else if (weekday === '0,6' || weekday === '6,0') {
        interpretation += ', on weekends (Sat-Sun)';
      } else if (weekday.includes('-')) {
        const [start, end] = weekday.split('-');
        interpretation += `, on ${weekdays[parseInt(start)]} to ${weekdays[parseInt(end)]}`;
      } else if (weekday.includes(',')) {
        const days = weekday.split(',').map(d => weekdays[parseInt(d)]).join(', ');
        interpretation += `, on ${days}`;
      } else {
        interpretation += `, on ${weekdays[parseInt(weekday)]}`;
      }
    }
    
    return interpretation;
  };

  const interpretation = interpretCron(cronParts);

  const handlePresetClick = (expression) => {
    setCronParts(expression.split(' '));
  };

  const handleExpressionInput = (e) => {
    const value = e.target.value;
    cursorPos.current = e.target.selectionStart;
    
    // Split by spaces but keep empty parts to maintain positions
    const parts = value.split(' ');
    
    // Only update if we have 5 or fewer parts
    if (parts.length <= 5) {
      // Don't auto-pad with asterisks - let user control the input
      setCronParts(parts);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorPos.current, cursorPos.current);
    }
  }, [cronParts]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronParts.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExpression = () => cronParts.join(' ');

  return (
    <div style={toolPageOuter}>
      <h1 style={toolPageTitle}>Cron Generator</h1>

      {/* Cron Format Table - Static */}
      <div style={{ background: '#3182ce', borderRadius: '12px',
        padding: '1.5rem', marginBottom: '1.5rem', color: 'white'
      }}>
        <div style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '1rem', opacity: 0.9 }}>
          Cron Expression Format
        </div>
        
        <div style={{  display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',  gap: '0.5rem',  marginBottom: '0.75rem' }}>
          {['*', '*', '*', '*', '*'].map((part, index) => (
            <div key={index} style={{ backgroundColor: 'white',  borderRadius: '8px', padding: '0.75rem',  textAlign: 'center', fontSize: '1.3rem',
              fontFamily: 'Monaco, Consolas, monospace', fontWeight: 'bold',  color: '#2c3e50'
            }}>
              {part}
            </div>
          ))}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', fontSize: '0.75rem', textAlign: 'center'  }}>
          <div>minute (0-59)</div>
          <div>hour (0-23)</div>
          <div>day of month (1-31)</div>
          <div>month (1-12)</div>
          <div>day of week (0-6)</div>
        </div>
      </div>

      {/* Expression with Copy */}
      <div style={{  display: 'flex',  gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input
          ref={inputRef}
          type="text"
          value={getExpression()}
          onChange={handleExpressionInput}
          style={{
            flex: 1,  padding: '0.875rem 1rem',  fontSize: '1.1rem',
            fontFamily: 'Monaco, Consolas, monospace', border: '2px solid #e1e8ed',
            borderRadius: '8px',  backgroundColor: '#f8f9fa',  color: '#2c3e50', outline: 'none'
          }}
        />
        <button
          onClick={copyToClipboard}
          style={{
            padding: '0.875rem 1.5rem', backgroundColor: copied ? '#48bb78' : '#3182ce',
            color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600',
            cursor: 'pointer',  transition: 'all 0.2s', whiteSpace: 'nowrap'
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Quick Presets - 6 in one line */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{  display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',  gap: '0.5rem' }}>
          {presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(preset.expression)}
              style={{
                padding: '0.5rem 0.25rem', backgroundColor: '#ffffff',  border: '1px solid #e1e8ed',  borderRadius: '6px',  cursor: 'pointer',
                fontSize: '0.75rem', fontWeight: '500',  color: '#2c3e50',  transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.borderColor = '#3182ce';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#e1e8ed';
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interpretation - Larger */}
      <div style={{  backgroundColor: '#ebf8ff', borderLeft: '4px solid #3182ce', padding: '1.5rem',  borderRadius: '8px'  }}>
        <div style={{  fontSize: '1.1rem', color: '#2b6cb0',  fontWeight: '500'  }}>
          {interpretation}
        </div>
      </div>
    </div>
  );
};

export default CronGenerator;
