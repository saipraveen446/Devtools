import { useState } from 'react';
import { toolPageCard, toolPageOuter, toolPageTitle } from '../styles/toolPageLayout';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState({
    length: 12,
    include_uppercase: true,
    include_lowercase: true,
    include_numbers: true,
    include_symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '—', color: '#a0aec0' };

    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (pwd.length >= 12) score += 25;
    if (/[a-z]/.test(pwd)) score += 10;
    if (/[A-Z]/.test(pwd)) score += 10;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;

    if (score < 30) return { score, label: 'Weak', color: '#e53e3e' };
    if (score < 60) return { score, label: 'Fair', color: '#dd6b20' };
    if (score < 80) return { score, label: 'Good', color: '#319795' };
    return { score, label: 'Strong', color: '#48bb78' };
  };

  const strength = calculateStrength(password);

  const generatePassword = () => {
    let charset = '';
    if (options.include_lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.include_uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.include_numbers) charset += '0123456789';
    if (options.include_symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setPassword('');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < options.length; i += 1) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  };

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const optionConfigs = [
    { key: 'include_uppercase', label: 'A–Z', title: 'Uppercase letters' },
    { key: 'include_lowercase', label: 'a–z', title: 'Lowercase letters' },
    { key: 'include_numbers', label: '0–9', title: 'Digits' },
    { key: 'include_symbols', label: '!@#', title: 'Symbols and punctuation' },
  ];

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const rangeFillPct = `${((options.length - 4) / 28) * 100}%`;

  return (
    <div style={toolPageOuter}>
      <h1 style={toolPageTitle}>Password Generator</h1>

      <div style={{ ...toolPageCard, marginBottom: 0 }}>
        <div
          style={{
            padding: '1.25rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '1rem',
                color: '#1a202c',
                marginBottom: '0.75rem',
                fontWeight: '700',
              }}
            >
              Password length
            </label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="range"
                className="password-gen-range"
                min="4"
                max="32"
                value={options.length}
                onChange={(e) =>
                  setOptions({ ...options, length: parseInt(e.target.value, 10) })
                }
                style={{
                  flex: 1,
                  outline: 'none',
                  cursor: 'pointer',
                  '--range-fill': rangeFillPct,
                }}
              />
              <span
                style={{
                  minWidth: '3rem',
                  textAlign: 'center',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#3182ce',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                }}
              >
                {options.length}
              </span>
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '1rem',
                color: '#1a202c',
                marginBottom: '0.75rem',
                fontWeight: '700',
              }}
            >
              Character types
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(92px, 1fr))',
                gap: '0.45rem',
              }}
            >
              {optionConfigs.map((option) => {
                const on = options[option.key];
                return (
                  <label
                    key={option.key}
                    title={option.title}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.32rem 0.4rem',
                      minHeight: '2rem',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      border: on ? '2px solid #1a365d' : '1px solid #cbd5e0',
                      backgroundColor: on ? '#2c5282' : '#edf2f7',
                      color: on ? '#ffffff' : '#4a5568',
                      fontSize: '0.72rem',
                      fontWeight: on ? '700' : '500',
                      fontFamily: 'inherit',
                      boxShadow: on ? 'inset 0 1px 0 rgba(255,255,255,0.12)' : 'none',
                      position: 'relative',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleOption(option.key)}
                      style={{
                        width: '12px',
                        height: '12px',
                        cursor: 'pointer',
                        accentColor: '#2c5282',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1, minWidth: 0, letterSpacing: '0.01em' }}>
                      {option.label}
                    </span>
                    {on ? (
                      <span
                        aria-hidden
                        style={{
                          flexShrink: 0,
                          fontSize: '0.55rem',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          padding: '0.1rem 0.28rem',
                          borderRadius: '3px',
                          backgroundColor: 'rgba(255,255,255,0.22)',
                          color: '#fff',
                          lineHeight: 1,
                        }}
                      >
                        On
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </div>

          <div
            style={{
              padding: '0.75rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e1e8ed',
            }}
          >
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '0.35rem',
              }}
            >
              Security tips
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.1rem',
                fontSize: '0.8rem',
                color: '#4a5568',
                lineHeight: 1.45,
              }}
            >
              <li>Use at least 12 characters when you can.</li>
              <li>Mix letters, numbers, and symbols.</li>
              <li>Do not reuse passwords across sites.</li>
              <li>Use a password manager for storage.</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={generatePassword}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#3182ce',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Generate password
          </button>

          <div>
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
                Generated password
              </label>
              {password ? (
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
                    fontFamily: 'inherit',
                  }}
                >
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
              ) : null}
            </div>
            <input
              type="text"
              readOnly
              value={password}
              placeholder='Click "Generate password" to create one...'
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.75rem 1rem',
                border: '2px solid #cbd5e0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'Monaco, Consolas, monospace',
                backgroundColor: '#ffffff',
                color: '#1a202c',
                outline: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            />
            {password ? (
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#718096' }}>
                Strength:{' '}
                <span style={{ color: strength.color, fontWeight: '600' }}>{strength.label}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
