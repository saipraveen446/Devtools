import { useState } from "react";
import { toolPageOuter, toolPageTitle } from "../styles/toolPageLayout";

function ChmodGenerator() {
  const [permissions, setPermissions] = useState({
    owner_read: false,
    owner_write: false,
    owner_execute: false,
    group_read: false,
    group_write: false,
    group_execute: false,
    other_read: false,
    other_write: false,
    other_execute: false
  });

  const getOctalValue = () => {
    const owner = (permissions.owner_read ? 4 : 0) + (permissions.owner_write ? 2 : 0) + (permissions.owner_execute ? 1 : 0);
    const group = (permissions.group_read ? 4 : 0) + (permissions.group_write ? 2 : 0) + (permissions.group_execute ? 1 : 0);
    const other = (permissions.other_read ? 4 : 0) + (permissions.other_write ? 2 : 0) + (permissions.other_execute ? 1 : 0);
    return `${owner}${group}${other}`;
  };

  const getSymbolicValue = () => {
    const owner = `${permissions.owner_read ? 'r' : '-'}${permissions.owner_write ? 'w' : '-'}${permissions.owner_execute ? 'x' : '-'}`;
    const group = `${permissions.group_read ? 'r' : '-'}${permissions.group_write ? 'w' : '-'}${permissions.group_execute ? 'x' : '-'}`;
    const other = `${permissions.other_read ? 'r' : '-'}${permissions.other_write ? 'w' : '-'}${permissions.other_execute ? 'x' : '-'}`;
    return `${owner}${group}${other}`;
  };

  const handleCheckboxChange = (field) => {
    setPermissions({
      ...permissions,
      [field]: !permissions[field]
    });
  };

  const octal = getOctalValue();
  const symbolic = getSymbolicValue();

  const columns = [
    { key: 'owner', label: 'Owner Rights', rights: 'u' },
    { key: 'group', label: 'Group Rights', rights: 'g' },
    { key: 'other', label: 'Others Rights', rights: 'o' }
  ];

  const rows = [
    { key: 'read', label: 'Read', value: 4 },
    { key: 'write', label: 'Write', value: 2 },
    { key: 'execute', label: 'Execute', value: 1 }
  ];

  return (
    <div style={toolPageOuter}>
      <h1 style={toolPageTitle}>Chmod Generator</h1>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',  overflow: 'hidden', marginBottom: '2rem'  }}>
        <div style={{  display: 'grid', gridTemplateColumns: '140px repeat(3, 1fr)',
          borderBottom: '2px solid #cbd5e0', backgroundColor: '#edf2f7'
        }}>
          <div style={{ padding: '1rem', fontWeight: '700', color: '#2d3748' }}></div>
          {columns.map(col => (
            <div key={col.key} style={{  padding: '1rem',  textAlign: 'center', fontWeight: '700', color: '#1a202c',  fontSize: '0.95rem'  }}>
              {col.label} <span style={{ color: '#4a5568', fontWeight: '600' }}>({col.rights})</span>
            </div>
          ))}
        </div>

        {rows.map((row, rowIndex) => (
          <div key={row.key}
            style={{  display: 'grid',  gridTemplateColumns: '140px repeat(3, 1fr)', borderBottom: rowIndex < rows.length - 1 ? '1px solid #e2e8f0' : 'none',
              backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f7fafc'
            }}
          >
            <div style={{  padding: '1rem',  fontWeight: '700', color: '#1a202c', display: 'flex',  alignItems: 'center', fontSize: '0.95rem' }}>
              {row.label} <span style={{ color: '#4a5568', fontWeight: '600', marginLeft: '6px' }}>({row.value})</span>
            </div>
            {columns.map(col => {
              const field = `${col.key}_${row.key}`;
              const isChecked = permissions[field];
              return (
                <div key={col.key}
                  style={{  padding: '1rem',  display: 'flex',  alignItems: 'center',  justifyContent: 'center',  cursor: 'pointer'  }}
                  onClick={() => handleCheckboxChange(field)}
                >
                  <div style={{
                    width: '20px',  height: '20px',  borderRadius: '3px',
                    backgroundColor: isChecked ? '#38bdf8' : '#ffffff',
                    border: `2px solid ${isChecked ? '#0ea5e9' : '#d1d5db'}`,
                    display: 'flex', alignItems: 'center',  justifyContent: 'center',  transition: 'all 0.15s ease'
                  }}>
                    {isChecked && ( <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>  ✓  </span>  )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{  display: 'block',  fontSize: '1rem',  color: '#1a202c',  marginBottom: '0.75rem',  fontWeight: '700'  }}>
            Numeric Permissions:
          </label>
          <input
            type="text" value={octal}  readOnly
            style={{ width: '100%',  padding: '1rem', fontSize: '1.75rem',
              border: '2px solid #cbd5e0',  borderRadius: '8px', backgroundColor: '#ffffff',
              color: '#1a202c', fontFamily: 'Monaco, Consolas, monospace', boxSizing: 'border-box',  outline: 'none',  fontWeight: '700'  
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '1rem', color: '#1a202c', marginBottom: '0.75rem', fontWeight: '700' }}>
            Symbolic Permissions:
          </label>
          <input
            type="text" value={symbolic} readOnly
            style={{
              width: '100%',  padding: '1rem',  fontSize: '1.75rem',  border: '2px solid #cbd5e0',  borderRadius: '8px',
              backgroundColor: '#ffffff',  color: '#1a202c',  fontFamily: 'Monaco, Consolas, monospace',  boxSizing: 'border-box',  outline: 'none',  fontWeight: '700'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ChmodGenerator;
