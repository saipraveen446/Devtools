import { useState } from 'react';
import { toolPageCard, toolPageOuter, toolPageTitle } from '../styles/toolPageLayout';

const ColorGenerator = () => {
  const [color, setColor] = useState('#1ea54c');
  const [copied, setCopied] = useState('');

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h;
    let s;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        default:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgbToHwb = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    let h = 0;
    if (chroma !== 0) {
      if (max === r) h = ((g - b) / chroma) % 6;
      else if (max === g) h = (b - r) / chroma + 2;
      else h = (r - g) / chroma + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    const w = Math.round(min * 100);
    const bk = Math.round((1 - max) * 100);
    return { h, w, b: bk };
  };

  const rgbToCmyk = (r, g, b) => {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;
    const k = Math.min(c, m, y);
    c = (c - k) / (1 - k) || 0;
    m = (m - k) / (1 - k) || 0;
    y = (y - k) / (1 - k) || 0;
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    };
  };

  const getColorName = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 'unknown';

    const { r, g, b } = rgb;

    if (r > 200 && g > 200 && b > 200) return 'white';
    if (r < 50 && g < 50 && b < 50) return 'black';
    if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) return r > 150 ? 'lightgray' : 'darkgray';
    if (r > 150 && g < 100 && b < 100) return 'red';
    if (r > 150 && g > 100 && b < 100) return 'orange';
    if (r > 150 && g > 150 && b < 100) return 'yellow';
    if (r < 100 && g > 150 && b < 100) return 'green';
    if (r < 100 && g > 100 && b > 150) return 'cyan';
    if (r < 100 && g < 100 && b > 150) return 'blue';
    if (r > 100 && g < 100 && b > 150) return 'purple';
    if (r > 150 && g < 150 && b > 100) return 'magenta';
    return 'custom';
  };

  const rgb = hexToRgb(color) || { r: 30, g: 165, b: 76 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hwb = rgbToHwb(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const colorName = getColorName(color);

  const formats = [
    { label: 'hex', value: color.toLowerCase() },
    { label: 'rgb', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'hsl', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'hwb', value: `hwb(${hwb.h} ${hwb.w}% ${hwb.b}%)` },
    { label: 'cmyk', value: `device-cmyk(${cmyk.c}% ${cmyk.m}% ${cmyk.y}% ${cmyk.k}%)` },
    { label: 'name', value: colorName },
  ];

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div style={toolPageOuter}>
      <h1 style={toolPageTitle}>Color Converter</h1>

      <div style={{ ...toolPageCard, padding: '2rem', paddingBottom: '2rem' }}>
        <p
          style={{
            fontSize: '0.9rem',
            color: '#718096',
            margin: '0 0 1.25rem 0',
            textAlign: 'center',
          }}
        >
          Hex, RGB, HSL, HWB, CMYK, and CSS name
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <span
            style={{
              color: '#1a202c',
              fontSize: '0.9rem',
              fontWeight: '700',
              minWidth: '100px',
            }}
          >
            Color picker
          </span>
          <label
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              background: color,
              borderRadius: '8px',
              border: '2px solid #cbd5e0',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
              }}
            />
            <span
              style={{
                padding: '0.65rem 1rem',
                fontSize: '0.95rem',
                fontFamily: 'Monaco, Consolas, monospace',
                textAlign: 'center',
                fontWeight: '600',
                color: (rgb.r + rgb.g + rgb.b) / 3 > 128 ? '#1a202c' : '#fff',
                flex: 1,
              }}
            >
              {color}
            </span>
          </label>
        </div>

        {formats.map((format) => (
          <div
            key={format.label}
            role="button"
            tabIndex={0}
            onClick={() => copyToClipboard(format.value, format.label)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyToClipboard(format.value, format.label);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.65rem 0',
              borderBottom: '1px solid #e2e8f0',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                color: '#1a202c',
                fontSize: '0.85rem',
                fontWeight: '700',
                minWidth: '100px',
                textAlign: 'right',
              }}
            >
              {format.label}
            </span>
            <div
              style={{
                flex: 1,
                background: '#ffffff',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#1a202c',
                fontSize: '0.9rem',
                fontFamily: 'Monaco, Consolas, monospace',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '2px solid #cbd5e0',
              }}
            >
              <span>{format.value}</span>
              <span
                style={{
                  fontSize: '0.85rem',
                  color: copied === format.label ? '#48bb78' : '#a0aec0',
                  marginLeft: '0.5rem',
                }}
              >
                {copied === format.label ? '✓' : '📋'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorGenerator;
