import { useState } from "react";
import { toolPageOuter, toolPageTitle } from "../styles/toolPageLayout";

function Base64Converter() {
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  // Frontend Base64 conversion
  const encode = (text) => {
    try {
      return btoa(text);
    } catch (error) {
      return 'Error: Invalid text';
    }
  };

  const decode = (base64) => {
    try {
      return atob(base64);
    } catch (error) {
      return 'Error: Invalid Base64';
    }
  };

  // Auto-convert on input change
  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    
    if (!text.trim()) {
      setOutputText('');
      return;
    }
    
    if (mode === 'encode') {
      setOutputText(encode(text));
    } else {
      setOutputText(decode(text));
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
      <h1 style={toolPageTitle}>Base64 Converter</h1>

      {/* Mode Selection Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <button
          onClick={() => {
            setMode('encode');
            setInputText('');
            setOutputText('');
          }}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: mode === 'encode' ? '#3182ce' : '#f8f9fa',
            color: mode === 'encode' ? '#ffffff' : '#495057',
            border: mode === 'encode' ? 'none' : '1px solid #e1e8ed',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Text → Base64
        </button>
        <button
          onClick={() => {
            setMode('decode');
            setInputText('');
            setOutputText('');
          }}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: mode === 'decode' ? '#3182ce' : '#f8f9fa',
            color: mode === 'decode' ? '#ffffff' : '#495057',
            border: mode === 'decode' ? 'none' : '1px solid #e1e8ed',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Base64 → Text
        </button>
      </div>

        <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        <div style={{ padding: '2rem', paddingBottom: '3rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '1rem',
              color: '#1a202c',
              marginBottom: '0.75rem',
              fontWeight: '700'
            }}>
              {mode === 'encode' ? 'Input Text:' : 'Input Base64:'}
            </label>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
              style={{
                width: '100%',
                height: '120px',
                padding: '1rem',
                border: '2px solid #cbd5e0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: mode === 'decode' ? 'Monaco, Consolas, monospace' : 'inherit',
                backgroundColor: '#ffffff',
                color: '#1a202c',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem'
            }}>
              <label style={{
                fontSize: '1rem',
                color: '#1a202c',
                fontWeight: '700'
              }}>
                {mode === 'encode' ? 'Base64 Output:' : 'Decoded Text:'}
              </label>
              {outputText && (
                <button
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
                    gap: '0.25rem'
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
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Base64Converter;
