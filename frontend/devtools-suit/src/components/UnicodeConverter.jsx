import { useState } from 'react';
import { toolPageOuter, toolPageTitle } from '../styles/toolPageLayout';

const UnicodeConverter = () => {
  const [mode, setMode] = useState('textToUnicode');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  const convertTextToUnicode = (text) => {
    return text.split('').map((char) => {
      const code = char.codePointAt(0);
      return `U+${code.toString(16).toUpperCase().padStart(4, '0')}`;
    }).join(' ');
  };

  const convertUnicodeToText = (unicode) => {
    try {
      const codes = unicode
        .replace(/\\u/g, '')
        .replace(/U\+/g, '')
        .replace(/0x/g, '')
        .split(/[\s,]+/)
        .filter((code) => code.trim() !== '')
        .map((code) => code.trim());

      let result = '';
      for (const code of codes) {
        const hexCode = parseInt(code, 16);
        if (Number.isNaN(hexCode) || hexCode < 0 || hexCode > 0x10ffff) {
          return `Error: Invalid Unicode code point: ${code}`;
        }
        result += String.fromCodePoint(hexCode);
      }

      return result || 'Error: No valid Unicode codes found';
    } catch {
      return 'Error: Invalid Unicode format';
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);

    if (!text.trim()) {
      setOutputText('');
      return;
    }

    if (mode === 'textToUnicode') {
      setOutputText(convertTextToUnicode(text));
    } else {
      setOutputText(convertUnicodeToText(text));
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
      <h1 style={toolPageTitle}>Unicode Converter</h1>

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
          onClick={() => handleModeChange('textToUnicode')}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: mode === 'textToUnicode' ? '#3182ce' : '#f8f9fa',
            color: mode === 'textToUnicode' ? '#ffffff' : '#495057',
            border: mode === 'textToUnicode' ? 'none' : '1px solid #e1e8ed',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Text → Unicode
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('unicodeToText')}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: mode === 'unicodeToText' ? '#3182ce' : '#f8f9fa',
            color: mode === 'unicodeToText' ? '#ffffff' : '#495057',
            border: mode === 'unicodeToText' ? 'none' : '1px solid #e1e8ed',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Unicode → Text
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
              {mode === 'textToUnicode' ? 'Input Text:' : 'Input Unicode:'}
            </label>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder={
                mode === 'textToUnicode'
                  ? 'Enter text to convert...'
                  : 'Enter codes (e.g. U+0048 U+0065 or 0048 0065 006C 006C 006F)...'
              }
              style={{
                width: '100%',
                height: '120px',
                padding: '1rem',
                border: '2px solid #cbd5e0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily:
                  mode === 'unicodeToText' ? 'Monaco, Consolas, monospace' : 'inherit',
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
                {mode === 'textToUnicode' ? 'Unicode Output:' : 'Decoded Text:'}
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

export default UnicodeConverter;
