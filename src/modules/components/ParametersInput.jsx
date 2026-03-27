import React from 'react';
import '../styles/parametersInput.css';

export function ParametersInput({ config, values, onChange }) {
  const handleChange = (paramName, value) => {
    const paramType = config.parameters.find(p => p.name === paramName)?.type;
    let parsedValue = value;

    if (paramType === 'number') {
      // Mantener cadena vacía para permitir edición sin reinyectar defaultValue.
      parsedValue = value === '' ? '' : parseFloat(value);
    }

    onChange({
      ...values,
      [paramName]: parsedValue,
    });
  };

  return (
    <div className="parameters-input-container">
      <div className="parameters-grid">
        {config.parameters.map((param) => (
          <div key={param.name} className="parameter-field">
            <label htmlFor={param.name} className="param-label">
              {param.label}
              {param.required && <span className="required-star">*</span>}
            </label>
            <input
              id={param.name}
              type={param.type}
              value={values[param.name] ?? param.defaultValue ?? ''}
              onChange={(e) => handleChange(param.name, e.target.value)}
              placeholder={param.defaultValue ? `ej: ${param.defaultValue}` : ''}
              className="param-input"
              step={param.type === 'number' ? 'any' : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParametersInput;
