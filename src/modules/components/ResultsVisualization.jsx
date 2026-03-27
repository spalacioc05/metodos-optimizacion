import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../styles/resultsVisualization.css';

let Plotly = null;

// Cargar Plotly de forma diferida
const loadPlotly = async () => {
  if (!Plotly) {
    Plotly = await import('plotly.js-dist');
  }
  return Plotly;
};

function isFiniteNumber(value) {
  return Number.isFinite(value);
}

function buildAxisValues(min, max, steps) {
  const out = [];
  const step = (max - min) / steps;
  for (let i = 0; i <= steps; i++) {
    out.push(min + i * step);
  }
  return out;
}

export function ResultsVisualization({ methodId, results, fn, parameters, is3D = false }) {
  const canvasFunctionRef = useRef(null);
  const canvasErrorRef = useRef(null);
  const canvasFnCurveRef = useRef(null);
  const plotly3DRef = useRef(null);
  const chartRefFunction = useRef(null);
  const chartRefError = useRef(null);
  const chartRefFnCurve = useRef(null);

  const destroyPreviousCharts = () => {
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

    if (plotly3DRef.current) {
      try {
        if (Plotly && Plotly.purge) {
          Plotly.purge(plotly3DRef.current);
        }
      } catch (e) {
        console.warn('Error destroying 3D chart:', e);
      }
    }
  };

  const drawRandomSearch3D = async () => {
    if (!plotly3DRef.current || !fn || !is3D) return;

    const PlotlyLib = await loadPlotly();
    if (!PlotlyLib) return;

    const xl = Number(parameters?.xl);
    const xu = Number(parameters?.xu);
    const yl = Number(parameters?.yl);
    const yu = Number(parameters?.yu);

    if (![xl, xu, yl, yu].every(isFiniteNumber) || xl >= xu || yl >= yu) {
      return;
    }

    const gridSteps = 35;
    const xValues = buildAxisValues(xl, xu, gridSteps);
    const yValues = buildAxisValues(yl, yu, gridSteps);
    const zValues = yValues.map(y =>
      xValues.map(x => {
        try {
          const z = fn(x, y);
          return Number.isFinite(z) ? z : null;
        } catch {
          return null;
        }
      })
    );

    const samplePoints = Array.isArray(results.samplePoints)
      ? results.samplePoints.filter(point => isFiniteNumber(point.x) && isFiniteNumber(point.y) && isFiniteNumber(point.value))
      : [];

    const bestPoint = results.bestPoint && isFiniteNumber(results.bestPoint.x) && isFiniteNumber(results.bestPoint.y) && isFiniteNumber(results.bestPoint.value)
      ? results.bestPoint
      : null;

    const traces = [
      {
        type: 'surface',
        x: xValues,
        y: yValues,
        z: zValues,
        colorscale: 'Viridis',
        opacity: 0.85,
        name: 'Superficie f(x, y)',
        showscale: true,
      },
    ];

    if (samplePoints.length > 0) {
      traces.push({
        type: 'scatter3d',
        mode: 'markers',
        name: 'Puntos aleatorios',
        x: samplePoints.map(p => p.x),
        y: samplePoints.map(p => p.y),
        z: samplePoints.map(p => p.value),
        marker: {
          size: 2.5,
          color: '#0057b8',
          opacity: 0.55,
        },
      });
    }

    if (bestPoint) {
      traces.push({
        type: 'scatter3d',
        mode: 'markers+text',
        name: 'Mejor punto',
        x: [bestPoint.x],
        y: [bestPoint.y],
        z: [bestPoint.value],
        text: ['Mejor'],
        textposition: 'top center',
        marker: {
          size: 7,
          color: '#e63946',
          symbol: 'diamond',
        },
      });
    }

    const zMin = Number(parameters?.zl);
    const zMax = Number(parameters?.zu);

    const scene = {
      xaxis: { title: 'x' },
      yaxis: { title: 'y' },
      zaxis: { title: 'f(x, y)' },
      camera: {
        eye: { x: 1.6, y: 1.6, z: 1.1 },
      },
    };

    if (isFiniteNumber(zMin) && isFiniteNumber(zMax) && zMin < zMax) {
      scene.zaxis.range = [zMin, zMax];
    }

    const layout = {
      margin: { l: 0, r: 0, b: 0, t: 0 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      scene,
      legend: {
        orientation: 'h',
        y: 1.02,
        x: 0,
      },
    };

    PlotlyLib.react(plotly3DRef.current, traces, layout, {
      responsive: true,
      displayModeBar: false,
    });
  };

  const drawCharts = () => {
    try {
      const ctxFunction = canvasFunctionRef.current?.getContext('2d');
      const ctxError = canvasErrorRef.current?.getContext('2d');

      if (!ctxFunction || !ctxError) {
        return;
      }

      const iterations = results.iterations || [];
      let labels = iterations.map((_, idx) => `i${idx + 1}`);
      let functionData = [];
      let errorData = [];

      if (['bisection', 'falsePosition'].includes(methodId)) {
        functionData = iterations.map(it => it.xl);
        errorData = iterations.map(it => Math.log10(Math.max(it.error, 1e-10)));
      } else if (methodId === 'quadraticInterpolation') {
        functionData = iterations.map(it => it.x2 || it.xr);
        errorData = iterations.map(it => Math.log10(Math.max(it.error, 1e-10)));
      } else if (['newtonRaphson', 'newtonExtrema'].includes(methodId)) {
        functionData = iterations.map(it => it.xn);
        errorData = iterations.map(it => Math.log10(Math.max(it.error, 1e-10)));
      } else if (methodId === 'goldenRatio') {
        functionData = iterations.map(it => (it.left + it.right) / 2);
        errorData = iterations.map(it => Math.log10(Math.max(it.error, 1e-10)));
      } else if (methodId === 'randomSearch') {
        let bestSoFar = -Infinity;
        functionData = iterations.map(it => {
          bestSoFar = Math.max(bestSoFar, it.value);
          return bestSoFar;
        });
        errorData = iterations.map(it => Math.log10(Math.max(it.error ?? 0, 1e-10)));
        labels = iterations.map((it, idx) => `m${it.sample ?? idx + 1}`);
      }

      chartRefFunction.current = new Chart(ctxFunction, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: methodId === 'randomSearch' ? 'Mejor valor acumulado' : 'Aproximación',
              data: functionData,
              borderColor: '#0066cc',
              backgroundColor: 'rgba(0, 102, 204, 0.05)',
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
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

      chartRefError.current = new Chart(ctxError, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Error (log10)',
              data: errorData,
              borderColor: '#ff6b6b',
              backgroundColor: 'rgba(255, 107, 107, 0.05)',
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
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

      // Solo dibujar 3D si es3D es true
      if (methodId === 'randomSearch' && is3D) {
        drawRandomSearch3D().catch(err => console.error('Error drawing 3D chart:', err));
        return;
      }

      const ctxFnCurve = canvasFnCurveRef.current?.getContext('2d');
      if (!ctxFnCurve || !fn) return;

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

      for (let x = xMin; x <= xMax; x += step) {
        try {
          const y = fn(x);
          if (isFinite(y)) {
            fnData.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
          }
        } catch {
          // Skip invalid points
        }
      }

      if (fnData.length === 0) return;

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
    } catch (error) {
      console.error('Error in drawCharts:', error);
    }
  };

  useEffect(() => {
    if (!results || !results.iterations || results.iterations.length === 0) {
      return undefined;
    }

    destroyPreviousCharts();

    const timer = setTimeout(() => {
      drawCharts();
    }, 50);

    return () => {
      clearTimeout(timer);
      destroyPreviousCharts();
    };
  }, [results, methodId, fn, is3D]);

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
          <h3 className="chart-title">{is3D ? 'Superficie 3D f(x, y)' : 'Función f(x)'}</h3>
          <div style={{ height: '350px', width: '100%', position: 'relative' }}>
            {is3D ? (
              <div ref={plotly3DRef} className="plotly-3d-container" />
            ) : (
              <canvas ref={canvasFnCurveRef}></canvas>
            )}
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
