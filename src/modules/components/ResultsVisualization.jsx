import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../styles/resultsVisualization.css';

export function ResultsVisualization({ methodId, results, fn, parameters }) {
  const canvasFunctionRef = useRef(null);
  const canvasErrorRef = useRef(null);
  const canvasFnCurveRef = useRef(null);
  const chartRefFunction = useRef(null);
  const chartRefError = useRef(null);
  const chartRefFnCurve = useRef(null);

  useEffect(() => {
    if (!results || !results.iterations || results.iterations.length === 0) {
      console.log('No results to display');
      return;
    }

    console.log('Drawing charts for method:', methodId);
    console.log('Iterations count:', results.iterations.length);
    console.log('First iteration:', results.iterations[0]);

    // Destruir gráficos anteriores
    if (chartRefFunction.current) {
      try {
        chartRefFunction.current.destroy();
      } catch (e) {
        console.warn('Error destroying function chart:', e);
      }
    }
    if (chartRefError.current) {
      try {
        chartRefError.current.destroy();
      } catch (e) {
        console.warn('Error destroying error chart:', e);
      }
    }
    if (chartRefFnCurve.current) {
      try {
        chartRefFnCurve.current.destroy();
      } catch (e) {
        console.warn('Error destroying function curve chart:', e);
      }
    }

    // Dibujar nuevos gráficos
    const timer = setTimeout(() => {
      drawCharts();
    }, 50);

    return () => clearTimeout(timer);
  }, [results, methodId]);

  const drawCharts = () => {
    try {
      // Obtener los contextos
      const ctxFunction = canvasFunctionRef.current?.getContext('2d');
      const ctxError = canvasErrorRef.current?.getContext('2d');
      const ctxFnCurve = canvasFnCurveRef.current?.getContext('2d');

      if (!ctxFunction || !ctxError || !ctxFnCurve) {
        console.warn('Canvas contexts not available');
        return;
      }

      const iterations = results.iterations;
      let labels = iterations.map((_, idx) => `i${idx + 1}`);

      // Extraer datos según método
      let functionData = [];
      let convergenceData = [];
      let errorData = [];

      if (['bisection', 'falsePosition'].includes(methodId)) {
        functionData = iterations.map(it => it.xl);
        convergenceData = iterations.map(it => it.xu);
        errorData = iterations.map(it => Math.log10(Math.max(it.error, 1e-10)));
      } else if (methodId === 'quadraticInterpolation') {
        functionData = iterations.map(it => it.x2 || it.xr);
        convergenceData = iterations.map(it => it.xr || 0);
        errorData = iterations.map(it => Math.log10(Math.max(it.error, 1e-10)));
      } else if (['newtonRaphson', 'newtonExtrema'].includes(methodId)) {
        functionData = iterations.map(it => it.xn);
        convergenceData = iterations.map(it => it.xNext);
        errorData = iterations.map(it => Math.log10(Math.max(it.error, 1e-10)));
      } else if (methodId === 'goldenRatio') {
        functionData = iterations.map(it => (it.left + it.right) / 2);
        convergenceData = iterations.map(it => it.right - it.left);
        errorData = iterations.map(it => Math.log10(Math.max(it.error, 1e-10)));
      } else if (methodId === 'randomSearch') {
        // Para búsqueda aleatoria, convergencia = mejor valor acumulado por muestra registrada.
        let bestSoFar = -Infinity;
        functionData = iterations.map(it => {
          bestSoFar = Math.max(bestSoFar, it.value);
          return bestSoFar;
        });
        errorData = iterations.map(it => Math.log10(Math.max(it.error ?? 0, 1e-10)));
        labels = iterations.map((it, idx) => `m${it.sample ?? idx + 1}`);
      }

      // Gráfico de convergencia
      try {
        chartRefFunction.current = new Chart(ctxFunction, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Aproximación',
                data: functionData,
                borderColor: '#0066cc',
                backgroundColor: 'rgba(0, 102, 204, 0.05)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#0066cc',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: '#666',
                  font: { size: 12, family: '"Inter", sans-serif' },
                  padding: 15,
                },
              },
            },
            scales: {
              y: {
                ticks: { color: '#666', font: { size: 11 } },
                grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
              },
              x: {
                ticks: { color: '#666', font: { size: 11 } },
                grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
              },
            },
          },
        });
        console.log('Function chart created successfully');
      } catch (err) {
        console.error('Error creating function chart:', err);
      }

      // Gráfico de error
      try {
        chartRefError.current = new Chart(ctxError, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Error (log₁₀)',
                data: errorData,
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.05)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#ff6b6b',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: '#666',
                  font: { size: 12, family: '"Inter", sans-serif' },
                  padding: 15,
                },
              },
            },
            scales: {
              y: {
                ticks: { color: '#666', font: { size: 11 } },
                grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
              },
              x: {
                ticks: { color: '#666', font: { size: 11 } },
                grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
              },
            },
          },
        });
        console.log('Error chart created successfully');
      } catch (err) {
        console.error('Error creating error chart:', err);
      }

      // Gráfico de la función f(x)
      try {
        if (!fn) {
          console.warn('Function fn not available');
          return;
        }

        // Determinar rango basado en parámetros o valores de iteración
        let xMin = -10;
        let xMax = 10;

        if (parameters) {
          if (parameters.xl !== undefined && parameters.xu !== undefined) {
            xMin = Math.min(parameters.xl, parameters.xu) - 1;
            xMax = Math.max(parameters.xl, parameters.xu) + 1;
          } else if (parameters.left !== undefined && parameters.right !== undefined) {
            xMin = Math.min(parameters.left, parameters.right) - 1;
            xMax = Math.max(parameters.left, parameters.right) + 1;
          }
        }

        const step = (xMax - xMin) / 100;
        const fnData = [];
        const fnLabels = [];

        for (let x = xMin; x <= xMax; x += step) {
          try {
            const y = fn(x);
            if (isFinite(y)) {
              fnData.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
              fnLabels.push(x.toFixed(2));
            }
          } catch (e) {
            // Skip invalid points
          }
        }

        if (fnData.length === 0) {
          console.warn('No valid function data to plot');
          return;
        }

        chartRefFnCurve.current = new Chart(ctxFnCurve, {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: 'f(x)',
                data: fnData,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.05)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 2,
                pointHoverRadius: 5,
                pointBackgroundColor: '#22c55e',
                showLine: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: '#666',
                  font: { size: 12, family: '"Inter", sans-serif' },
                  padding: 15,
                },
              },
            },
            scales: {
              y: {
                ticks: { color: '#666', font: { size: 11 } },
                grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
              },
              x: {
                ticks: { color: '#666', font: { size: 11 } },
                grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
              },
            },
          },
        });
        console.log('Function curve chart created successfully');
      } catch (err) {
        console.error('Error creating function curve chart:', err);
      }
    } catch (error) {
      console.error('Error in drawCharts:', error);
    }
  };

  if (!results) {
    return (
      <div className="results-visualization">
        <p style={{ textAlign: 'center', color: '#999' }}>Ejecuta el método para ver resultados</p>
      </div>
    );
  }

  return (
    <div className="results-visualization">
      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="chart-title">Función f(x)</h3>
          <div style={{ height: '350px', width: '100%', position: 'relative' }}>
            <canvas ref={canvasFnCurveRef}></canvas>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Convergencia</h3>
          <div style={{ height: '350px', width: '100%', position: 'relative' }}>
            <canvas ref={canvasFunctionRef}></canvas>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Error</h3>
          <div style={{ height: '350px', width: '100%', position: 'relative' }}>
            <canvas ref={canvasErrorRef}></canvas>
          </div>
        </div>
      </div>

      {/* Resumen de resultados */}
      <div className="results-summary">
        <div className="summary-item">
          <span className="label">Raíz/Óptimo:</span>
          <span className="value">
            {results.root !== undefined ? results.root.toFixed(8) : 'N/A'}
          </span>
        </div>
        <div className="summary-item">
          <span className="label">Error final:</span>
          <span className="value">
            {results.finalError !== undefined ? results.finalError.toFixed(10) : 'N/A'}
          </span>
        </div>
        <div className="summary-item">
          <span className="label">Iteraciones:</span>
          <span className="value">{results.totalIterations || 0}</span>
        </div>
        <div className="summary-item">
          <span className="label">Convergencia:</span>
          <span className={`status ${results.converged ? 'success' : 'warning'}`}>
            {results.converged ? '✓ Alcanzada' : '✗ No alcanzada'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ResultsVisualization;
