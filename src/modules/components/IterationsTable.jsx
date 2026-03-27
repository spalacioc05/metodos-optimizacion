import React, { useState } from 'react';
import '../styles/iterationsTable.css';

export function IterationsTable({ iterations, methodId }) {
  const [expanded, setExpanded] = useState(false);

  if (!iterations || iterations.length === 0) {
    return <div className="iterations-table empty">Sin datos de iteraciones</div>;
  }

  // Límitar iteraciones mostradas si hay muchas
  const displayIterations = expanded ? iterations : iterations.slice(0, 10);
  const hasMore = iterations.length > 10;

  // Obtener las claves del primer objeto para definir columnas
  const firstIterations = iterations[0];
  const columns = Object.keys(firstIterations).filter(
    key => !['isBest'].includes(key)
  );

  const formatValue = (value) => {
    if (typeof value === 'number') {
      if (Math.abs(value) < 1e-6 && value !== 0) {
        return value.toExponential(4);
      }
      return value.toFixed(6);
    }
    if (typeof value === 'boolean') {
      return value ? '✓' : '✗';
    }
    return String(value);
  };

  return (
    <div className="iterations-table-container">
      <h3 className="table-title">Tabla de Iteraciones</h3>
      
      <div className="table-wrapper">
        <table className="iterations-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className={`col-${col.toLowerCase()}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayIterations.map((iteration, idx) => (
              <tr key={idx} className={iteration.isBest ? 'best-row' : ''}>
                {columns.map((col) => (
                  <td key={`${idx}-${col}`} className={`col-${col.toLowerCase()}`}>
                    {formatValue(iteration[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="table-footer">
          <button
            className="btn-expand"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? `← Mostrar menos (${iterations.length} total)` : `→ Ver todas las iteraciones (${iterations.length} total)`}
          </button>
        </div>
      )}
    </div>
  );
}

export default IterationsTable;
