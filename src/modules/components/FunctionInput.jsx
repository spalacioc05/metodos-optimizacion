import React, { useRef } from 'react';
import '../styles/functionInput.css';

const MATH_SYMBOLS = [
  { label: 'sin', value: 'sin(' },
  { label: 'cos', value: 'cos(' },
  { label: 'tan', value: 'tan(' },
  { label: 'log', value: 'log(' },
  { label: 'ln', value: 'log(' },
  { label: 'e^', value: 'exp(' },
  { label: '√', value: 'sqrt(' },
  { label: 'π', value: 'pi' },
  { label: '^2', value: '^2' },
  { label: '^3', value: '^3' },
  { label: '^x', value: '^(' },
  { label: 'x²', value: 'x^2' },
  { label: '|x|', value: 'abs(' },
  { label: '1/x', value: '1/x' },
];

export function FunctionInput({ value, onChange }) {
  const inputRef = useRef(null);

  const insertSymbol = (symbol) => {
    const textarea = inputRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const after = value.substring(end);

    let newValue = before + symbol + after;
    
    // Si el símbolo termina con '(', añadir ')' automáticamente
    if (symbol.endsWith('(')) {
      newValue = before + symbol + ')' + after;
    }

    onChange(newValue);

    // Restaurar el curser
    setTimeout(() => {
      textarea.focus();
      const newPos = before.length + symbol.length + (symbol.endsWith('(') ? 0 : 0);
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="function-input-container">
      <div className="input-wrapper">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ingresa una función: sin(x) + 2*x^2"
          className="function-textarea"
          rows={3}
          spellCheck="false"
        />
      </div>

      <div className="symbols-toolbar">
        <div className="symbols-grid">
          {MATH_SYMBOLS.map((symbol) => (
            <button
              key={symbol.value}
              className="symbol-btn"
              onClick={() => insertSymbol(symbol.value)}
              title={symbol.label}
              type="button"
            >
              {symbol.label}
            </button>
          ))}
        </div>
      </div>

      <div className="input-actions">
        <button
          className="btn-clear"
          onClick={handleClear}
          type="button"
          title="Limpiar función"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}

export default FunctionInput;
