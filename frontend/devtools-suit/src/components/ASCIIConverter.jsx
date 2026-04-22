import { useState } from 'react';
import { toolPageOuter, toolPageTitle } from '../styles/toolPageLayout';

const ASCIIConverter = () => {
  const [mode, setMode] = useState('textToAscii');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  const convertTextToAscii = (text) => {
    return text.split('').map((char) => char.charCodeAt(0)).join(' ');
  };

  const convertAsciiToText = (ascii) => {
    try {
      const numbers = ascii
        .replace(/[^\d\s,]/g, '')
        .split(/[\s,]+/)
        .filter((num) => num.trim() !== '')
        .map((num) => parseInt(num.trim(), 10));

      const validNumbers = numbers.filter((num) => num >= 0 && num <= 127);

      if (validNumbers.length === 0) {
        return 'Error: No valid ASCII codes found (0-127)';
      }

      return validNumbers.map((num) => String.fromCharCode(num)).join('');
    } catch {
      return 'Error: Invalid ASCII format';
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);

    if (!text.trim()) {
      setOutputText('');
      return;
    }

    if (mode === 'textToAscii') {
      setOutputText(convertTextToAscii(text));
    } else {
      setOutputText(convertAsciiToText(text));
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setInputText('');
    setOutputText('');
  };

  return (
    <div style={toolPageOuter}>
      <h1 style={toolPageTitle}>ASCII Converter</h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <button
          type="button"
          onClick={() => handleModeChange('textToAscii')}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: mode === 'textToAscii' ? '#3182ce' : '#f8f9fa',
            color: mode === 'textToAscii' ? '#ffffff' : '#495057',
            border: mode === 'textToAscii' ? 'none' : '1px solid #e1e8ed',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Text → ASCII
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('asciiToText')}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: mode === 'asciiToText' ? '#3182ce' : '#f8f9fa',
            color: mode === 'asciiToText' ? '#ffffff' : '#495057',
            border: mode === 'asciiToText' ? 'none' : '1px solid #e1e8ed',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          ASCII → Text
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          marginBottom: '2rem',
        }}
      >
        <div style={{ padding: '2rem', paddingBottom: '3rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '1rem',
                color: '#1a202c',
                marginBottom: '0.75rem',
                fontWeight: '700',
              }}
            >
              {mode === 'textToAscii' ? 'Input Text:' : 'Input ASCII:'}
            </label>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder={
                mode === 'textToAscii'
                  ? 'Enter text to convert...'
                  : 'Enter ASCII codes (e.g. 72 101 108 108 111)...'
              }
              style={{
                width: '100%',
                height: '120px',
                padding: '1rem',
                border: '2px solid #cbd5e0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily:
                  mode === 'asciiToText' ? 'Monaco, Consolas, monospace' : 'inherit',
                backgroundColor: '#ffffff',
                color: '#1a202c',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <label
                style={{
                  fontSize: '1rem',
                  color: '#1a202c',
                  fontWeight: '700',
                }}
              >
                {mode === 'textToAscii' ? 'ASCII Output:' : 'Decoded Text:'}
              </label>
              {outputText && (
                <button
                  type="button"
                  onClick={copyToClipboard}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: copied ? '#48bb78' : '#3182ce',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
              )}
            </div>
            <textarea
              value={outputText}
              readOnly
              placeholder="Output will appear here..."
              style={{
                width: '100%',
                height: '120px',
                padding: '1rem',
                border: '2px solid #cbd5e0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'Monaco, Consolas, monospace',
                backgroundColor: '#ffffff',
                color: '#1a202c',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASCIIConverter;
