import { useState, useMemo } from 'react';
import { toolPageCard, toolPageOuter, toolPageTitle } from '../styles/toolPageLayout';

const CaseConverter = () => {
  const [textInput, setTextInput] = useState('');
  const [copiedCase, setCopiedCase] = useState('');
  const [selectedCase, setSelectedCase] = useState('');

  // Calculate word and character counts in real-time
  const wordCount = textInput.trim() ? textInput.trim().split(/\s+/).length : 0;
  const charCount = textInput.length;
  // Case types - simplified
  const caseTypes = [
    { key: 'sentence_case', label: 'Sentence', title: 'Sentence case' },
    { key: 'lowercase', label: 'lower', title: 'lowercase' },
    { key: 'uppercase', label: 'UPPER', title: 'UPPERCASE' },
    { key: 'capitalized_case', label: 'Title', title: 'Capitalized case' },
    { key: 'alternating_case', label: 'aLtErN', title: 'Alternating case' },
    { key: 'inverse_case', label: 'Reverse', title: 'Reverse characters' },
  ];

  const convertedText = useMemo(() => {
    if (!textInput.trim()) return {};
    const text = textInput;
    return {
      sentence_case: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      lowercase: text.toLowerCase(),
      uppercase: text.toUpperCase(),
      capitalized_case: text.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      alternating_case: text
        .split('')
        .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
        .join(''),
      inverse_case: text.split('').reverse().join(''),
    };
  }, [textInput]);

  const copyToClipboard = async (text, caseKey) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCase(caseKey);
      setTimeout(() => setCopiedCase(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div style={toolPageOuter}>
      <h1 style={toolPageTitle}>Case Converter</h1>
      <p
        style={{
          fontSize: '0.9rem',
          color: '#718096',
          margin: '0 0 1.25rem 0',
          textAlign: 'center',
        }}
      >
        Transform your text into any case format instantly
      </p>
      <div style={{ ...toolPageCard, padding: '1.5rem', marginBottom: 0 }}>
          {/* Input Section */}
          <div style={{   marginBottom: '1.5rem' }}>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="hello world"
              style={{
                width: '100%',  height: '120px',  padding: '1rem',  fontSize: '1rem',
                border: '2px solid #e2e8f0',  borderRadius: '8px',  outline: 'none',  boxSizing: 'border-box',
                resize: 'vertical',  transition: 'border-color 0.2s ease',  fontFamily: 'inherit',
                backgroundColor: '#ffffff',  color: '#2d3748',  lineHeight: '1.5'
              }}
              onFocus={(e) => {  e.target.style.borderColor = '#3182ce';  }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0';  }}
            />
          </div>

          {/* Case type chips — single row, compact */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                gap: '0.45rem',
                width: '100%',
              }}
            >
              {caseTypes.map((caseType) => (
                <button
                  key={caseType.key}
                  type="button"
                  title={caseType.title}
                  onClick={() => setSelectedCase(caseType.key)}
                  style={{
                    flex: '1 1 0',
                    minWidth: 0,
                    minHeight: '2.25rem',
                    background: selectedCase === caseType.key ? '#2b6cb0' : '#3182ce',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.5rem 0.35rem',
                    fontSize: '0.78rem',
                    fontWeight: selectedCase === caseType.key ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.25,
                    boxShadow:
                      selectedCase === caseType.key
                        ? '0 1px 3px rgba(43, 108, 176, 0.35)'
                        : '0 1px 2px rgba(49, 130, 206, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      selectedCase === caseType.key ? '#2b6cb0' : '#2c5282';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      selectedCase === caseType.key ? '#2b6cb0' : '#3182ce';
                  }}
                >
                  {caseType.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div style={{  padding: '0.75rem',  background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem'  }}>
            <div style={{  fontSize: '0.95rem',  color: '#4a5568',  fontWeight: '500',  textAlign: 'center'  }}>
              Word Count: <span style={{ color: '#3182ce', fontWeight: '600' }}>{wordCount}</span>, 
              Character Count: <span style={{ color: '#3182ce', fontWeight: '600' }}>{charCount}</span>, 
              Line Count: <span style={{ color: '#3182ce', fontWeight: '600' }}>{textInput ? textInput.split('\n').length : 0}</span>, 
              Sentence Count: <span style={{ color: '#3182ce', fontWeight: '600' }}>{textInput ? textInput.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0}</span>
            </div>
          </div>

          {/* Output Section */}
          <div style={{  marginBottom: '1rem' }}>
            <div style={{  marginBottom: '1rem',  display: 'flex',  alignItems: 'center',  justifyContent: 'space-between',  gap: '1rem'  }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h3 style={{  fontSize: '1.1rem',  fontWeight: '600',  color: '#2d3748',  margin: 0 }}>
                  {selectedCase && textInput
                    ? `${caseTypes.find((c) => c.key === selectedCase)?.title ?? ''} result:`
                    : 'Output:'}
                </h3>
                {copiedCase && (
                  <span style={{  background: '#48bb78',  color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem',  fontWeight: '600'  }}>  ✓ Copied! </span>
                )}
              </div>
              {textInput && (
                <button onClick={() => copyToClipboard(convertedText[selectedCase] || textInput, 'output')}
                  style={{  background: copiedCase === 'output' ? '#48bb78' : '#3182ce',  color: 'white',
                    border: 'none', borderRadius: '6px', padding: '0.5rem 1rem',  fontSize: '0.85rem',  fontWeight: '500',
                    cursor: 'pointer',  display: 'flex',  alignItems: 'center',  gap: '0.25rem'
                  }} >
                  {copiedCase === 'output' ? '✓ Copied' : '📋 Copy'}
                </button>
              )}
            </div>
            
            <div style={{
              background: '#f7fafc', borderRadius: '8px',  padding: '1rem', minHeight: '80px',
              border: '2px solid #e2e8f0',  fontFamily: 'Monaco, Consolas, "SF Mono", monospace',  fontSize: '1rem',
              color: '#2d3748',  lineHeight: '1.6', wordBreak: 'break-word',  whiteSpace: 'pre-wrap'
            }}>
              {textInput ? ( selectedCase ? ( convertedText[selectedCase] || textInput  ) : (  textInput  )
              ) : (  <span style={{   color: '#a0aec0',   fontStyle: 'italic',  fontFamily: 'inherit'  }}>  Your converted text will appear here...  </span> )}
            </div>
          </div>

        </div>
    </div>
  );
};

export default CaseConverter;
