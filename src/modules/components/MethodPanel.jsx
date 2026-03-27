import React, { useState, useCallback, useEffect } from 'react';
import { METHOD_CONFIGS } from '../methods';
import FunctionInput from './FunctionInput';
import ParametersInput from './ParametersInput';
import ResultsVisualization from './ResultsVisualization';
import IterationsTable from './IterationsTable';
import {
  BisectionMethod,
  FalsePositionMethod,
  QuadraticInterpolationMethod,
  NewtonRaphsonMethod,
  NewtonExtremaMethod,
  GoldenRatioMethod,
  RandomSearchMethod,
} from '../methods';
import { createExpression, extractExpressionVariables } from '../utils/ExpressionParser';
import '../styles/methodPanel.css';

const METHOD_CLASSES = {
  bisection: BisectionMethod,
  falsePosition: FalsePositionMethod,
  quadraticInterpolation: QuadraticInterpolationMethod,
  newtonRaphson: NewtonRaphsonMethod,
  newtonExtrema: NewtonExtremaMethod,
  goldenRatio: GoldenRatioMethod,
  randomSearch: RandomSearchMethod,
};

function getDefaultParameters(config) {
  return config.parameters.reduce((acc, param) => {
    if (param.defaultValue !== undefined) {
      acc[param.name] = param.defaultValue;
    }
    return acc;
  }, {});
}

export function MethodPanel({ methodId, onMenuOpen }) {
  const methodConfig = METHOD_CONFIGS[methodId];
  const [functionExpr, setFunctionExpr] = useState('sin(x) - 0.5');
  const [parameters, setParameters] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const defaults = getDefaultParameters(methodConfig);
    setParameters(defaults);
    setResults(null);
    setError(null);

    if (methodId === 'randomSearch') {
      setFunctionExpr('2.25*x*y + 1.75*y - 1.5*x^2 - 2*y^2');
    } else {
      setFunctionExpr('sin(x) - 0.5');
    }
  }, [methodId, methodConfig]);

  const validateInputs = useCallback(() => {
    const errors = [];

    if (!functionExpr.trim()) {
      errors.push('Ingresa una función válida');
    }

    methodConfig.parameters.forEach(param => {
      if (param.required && !(param.name in parameters)) {
        errors.push(`${param.label} es requerido`);
      }
    });

    // Validar cambio de signo para Bisección y Falsa Posición
    if ((methodId === 'bisection' || methodId === 'falsePosition') && parameters.xl !== undefined && parameters.xu !== undefined) {
      try {
        const fn = createExpression(functionExpr);
        const xl = parseFloat(parameters.xl);
        const xu = parseFloat(parameters.xu);
        
        if (!isNaN(xl) && !isNaN(xu)) {
          const fxl = fn(xl);
          const fxu = fn(xu);
          
          // Cambio de signo: signos opuestos o uno de ellos es cero
          const hasSignChange = fxl * fxu <= 0 && (fxl !== 0 || fxu !== 0);
          
          if (!hasSignChange) {
            errors.push(`⚠️ ${methodId === 'bisection' ? 'Bisección' : 'Falsa Posición'} requiere cambio de signo`);
          }
        }
      } catch (err) {
        // Silenciar error de evaluación en validación
      }
    }

    if (methodId === 'randomSearch') {
      const samples = Number(parameters.samples);
      if (!Number.isFinite(samples) || samples <= 0) {
        errors.push('Número de muestras debe ser mayor que 0');
      }

      if (parameters.xl === undefined || parameters.xu === undefined || parameters.yl === undefined || parameters.yu === undefined) {
        errors.push('Debes ingresar x mínimo, x máximo, y mínimo y y máximo');
      }

      // Si ingresa z mínimo y z máximo, exigir que la función tenga (x, y) para modo 3D
      const hasZBounds = parameters.zl !== undefined && parameters.zu !== undefined;
      if (hasZBounds) {
        const vars = extractExpressionVariables(functionExpr);
        if (!(vars.includes('x') && vars.includes('y'))) {
          errors.push('Para modo 3D, la función debe usar dos variables: x e y');
        }
      }
    }

    return errors;
  }, [functionExpr, parameters, methodConfig, methodId]);

  const handleExecute = useCallback(async () => {
    setError(null);
    const validationErrors = validateInputs();
    
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    setLoading(true);
    try {
      const fn = createExpression(functionExpr);
      const MethodClass = METHOD_CLASSES[methodId];

      // Random Search recibe configuración en constructor (samples, seed, etc.)
      const method = methodId === 'randomSearch'
        ? new MethodClass(fn, {
            samples: Number.isFinite(parameters.samples)
              ? Math.max(1, Math.floor(parameters.samples))
              : METHOD_CONFIGS.randomSearch.parameters.find(p => p.name === 'samples')?.defaultValue ?? 10000,
          })
        : new MethodClass(fn);

      // Usar tolerance del parámetro o el defaultValue si no está definida
      const toleranceParam = methodConfig.parameters.find(p => p.name === 'tolerance');
      const tolerance = parameters.tolerance !== undefined ? parameters.tolerance : toleranceParam?.defaultValue;

      let result;

      if (methodId === 'bisection') {
        result = method.solve(parameters.xl, parameters.xu, tolerance);
      } else if (methodId === 'falsePosition') {
        result = method.solve(parameters.xl, parameters.xu, tolerance);
      } else if (methodId === 'quadraticInterpolation') {
        result = method.solve(parameters.x0, parameters.x1, parameters.x2, tolerance);
      } else if (methodId === 'newtonRaphson') {
        result = method.solve(parameters.x0, tolerance);
      } else if (methodId === 'newtonExtrema') {
        result = method.solve(parameters.x0, tolerance);
      } else if (methodId === 'goldenRatio') {
        result = method.solve(parameters.xl, parameters.xu, tolerance);
      } else if (methodId === 'randomSearch') {
        // Si z mínimo y z máximo están ingresados, usar modo 3D; de lo contrario, modo 2D normal.
        const hasZBounds = parameters.zl !== undefined && parameters.zu !== undefined;
        if (hasZBounds) {
          result = method.solve3D(parameters.xl, parameters.xu, parameters.yl, parameters.yu, parameters.zl, parameters.zu);
        } else {
          result = method.solve2D(parameters.xl, parameters.xu, parameters.yl, parameters.yu);
        }
      }

      setResults(result);
    } catch (err) {
      setError(err.message);
      console.error('Execution error:', err);
    } finally {
      setLoading(false);
    }
  }, [methodId, functionExpr, parameters, validateInputs, methodConfig]);

  return (
    <div className="method-panel">
      {/* Header con botón de menú */}
      <div className="panel-header">
        <button className="btn-menu-toggle" onClick={onMenuOpen} title="Abrir menú">
          ☰
        </button>
        <h2 className="panel-title">{methodConfig.name}</h2>
        <p className="panel-description">{methodConfig.description}</p>
      </div>

      {/* Contenedor principal */}
      <div className="panel-content">
        {/* Sección de entrada */}
        <section className="input-section">
          <div className="input-group">
            <h3>Función</h3>
            <FunctionInput value={functionExpr} onChange={setFunctionExpr} />
          </div>

          <div className="input-group">
            <h3>Parámetros</h3>
            <ParametersInput
              config={methodConfig}
              values={parameters}
              onChange={setParameters}
            />
          </div>

          <button
            className="btn-execute"
            onClick={handleExecute}
            disabled={loading}
          >
            {loading ? 'Ejecutando...' : 'Ejecutar'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </section>

        {/* Sección de resultados */}
        {results && (
          <section className="results-section">
            <div className="results-container">
              <ResultsVisualization
                methodId={methodId}
                results={results}
                fn={createExpression(functionExpr)}
                parameters={parameters}
                is3D={methodId === 'randomSearch' && parameters.zl !== undefined && parameters.zu !== undefined}
              />
            </div>

            <div className="table-container">
              <IterationsTable
                iterations={results.iterations}
                methodId={methodId}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default MethodPanel;
