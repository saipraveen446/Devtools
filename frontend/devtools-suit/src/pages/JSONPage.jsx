import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { toolPageOuter, toolPageTitle } from "../styles/toolPageLayout";

const INDENT = 2;

const PLACEHOLDER_FORMAT_INPUT = '{"hello":"world","foo":"bar"}';

const PLACEHOLDER_MINIFY_INPUT = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": [
    "reading",
    "swimming",
    "coding"
  ]
}`;

const PLACEHOLDER_OUTPUT_FORMAT = `{
  "hello": "world",
  "foo": "bar"
}`;

const PLACEHOLDER_OUTPUT_MINIFY =
  '{"name":"John Doe","age":30,"city":"New York","hobbies":["reading","swimming","coding"]}';

/** Pretty-printed sample for Minify mode “Load example” */
const EXAMPLE_OBJECT = {
  name: "John Doe",
  age: 30,
  city: "New York",
  hobbies: ["reading", "swimming", "coding"],
};
const MINIFY_LOAD_EXAMPLE = JSON.stringify(EXAMPLE_OBJECT, null, INDENT);

/** Compact sample for Format mode “Load example” (pretty-printed in output) */
const FORMAT_LOAD_EXAMPLE = '{"hello":"world","foo":"bar"}';

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

function JSONPage() {
  const [mode, setMode] = useState("format");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  const inputMin = 96;
  const outputMin = 96;

  const getMaxPx = useCallback(() => {
    if (typeof window === "undefined") return 520;
    return Math.min(Math.floor(window.innerHeight * 0.42), 520);
  }, []);

  const fitTextareas = useCallback(() => {
    const maxIn = getMaxPx();
    const maxOut = getMaxPx();

    const fit = (el, minPx, maxPx) => {
      if (!el) return;
      el.style.height = "0px";
      const sh = el.scrollHeight;
      const h = clamp(sh, minPx, maxPx);
      el.style.height = `${h}px`;
      el.style.overflowY = sh > maxPx ? "auto" : "hidden";
    };

    fit(inputRef.current, inputMin, maxIn);
    fit(outputRef.current, outputMin, maxOut);
  }, [getMaxPx]);

  useEffect(() => {
    const raw = inputText.trim();
    if (!raw) {
      setOutputText("");
      setError("");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setError("");
      setOutputText(
        mode === "format"
          ? JSON.stringify(parsed, null, INDENT)
          : JSON.stringify(parsed)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setOutputText("");
    }
  }, [inputText, mode]);

  useLayoutEffect(() => {
    fitTextareas();
  }, [inputText, outputText, mode, error, fitTextareas]);

  useEffect(() => {
    const onResize = () => fitTextareas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fitTextareas]);

  const copyToClipboard = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const loadExample = () => {
    setInputText(mode === "format" ? FORMAT_LOAD_EXAMPLE : MINIFY_LOAD_EXAMPLE);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setInputText("");
    setOutputText("");
    setError("");
  };

  const textareaBase = {
    width: "100%",
    padding: "1rem",
    border: "2px solid #cbd5e0",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: "Monaco, Consolas, monospace",
    backgroundColor: "#ffffff",
    color: "#1a202c",
    resize: "none",
    outline: "none",
    boxSizing: "border-box",
    lineHeight: 1.45,
  };

  const inputPlaceholder =
    mode === "format" ? PLACEHOLDER_FORMAT_INPUT : PLACEHOLDER_MINIFY_INPUT;
  const outputPlaceholder =
    mode === "format" ? PLACEHOLDER_OUTPUT_FORMAT : PLACEHOLDER_OUTPUT_MINIFY;

  return (
    <div style={toolPageOuter}>
      <h1 style={toolPageTitle}>JSON Tools</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <button
          type="button"
          onClick={() => switchMode("format")}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: mode === "format" ? "#3182ce" : "#f8f9fa",
            color: mode === "format" ? "#ffffff" : "#495057",
            border: mode === "format" ? "none" : "1px solid #e1e8ed",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Format JSON
        </button>
        <button
          type="button"
          onClick={() => switchMode("minify")}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: mode === "minify" ? "#3182ce" : "#f8f9fa",
            color: mode === "minify" ? "#ffffff" : "#495057",
            border: mode === "minify" ? "none" : "1px solid #e1e8ed",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Minify JSON
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflow: "hidden",
          marginBottom: "2rem",
        }}
      >
        <div style={{ padding: "2rem", paddingBottom: "3rem" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <button
              type="button"
              onClick={loadExample}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#edf2f7",
                color: "#4a5568",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              Load example
            </button>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "1rem",
                color: "#1a202c",
                marginBottom: "0.75rem",
                fontWeight: "700",
              }}
            >
              Input JSON:
            </label>
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={inputPlaceholder}
              spellCheck={false}
              style={{ ...textareaBase }}
            />
          </div>

          {error ? (
            <div
              style={{
                padding: "0.75rem 1rem",
                backgroundColor: "#fff5f5",
                color: "#c53030",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontSize: "0.875rem",
                border: "1px solid #feb2b2",
                fontFamily: "Monaco, Consolas, monospace",
              }}
            >
              {error}
            </div>
          ) : null}

          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <label
                style={{
                  fontSize: "1rem",
                  color: "#1a202c",
                  fontWeight: "700",
                }}
              >
                {mode === "format" ? "Formatted output:" : "Minified output:"}
              </label>
              {outputText ? (
                <button
                  type="button"
                  onClick={copyToClipboard}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: copied ? "#48bb78" : "#3182ce",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  {copied ? "✓ Copied" : "📋 Copy"}
                </button>
              ) : null}
            </div>
            <textarea
              ref={outputRef}
              readOnly
              value={outputText}
              placeholder={outputPlaceholder}
              spellCheck={false}
              style={{ ...textareaBase }}
            />
          </div>

          <p
            style={{
              margin: 0,
              fontSize: "0.85rem",
              color: "#718096",
              textAlign: "center",
            }}
          >
            Boxes grow with your JSON up to about half the window height, then
            scroll. Switch mode clears the fields.
          </p>
        </div>
      </div>
    </div>
  );
}

export default JSONPage;
