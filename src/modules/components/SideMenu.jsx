import React from 'react';
import { METHOD_CONFIGS } from '../methods';
import '../styles/sideMenu.css';

export function SideMenu({ isOpen, onMethodSelect, activeMethod, onToggle }) {
  const methods = Object.values(METHOD_CONFIGS);
  const rootMethods = methods.filter(m => m.category === 'root');
  const optimizationMethods = methods.filter(m => m.category === 'optimization');
  const multidimensionalMethods = methods.filter(m => m.category === 'multidimensional');

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onToggle} />
      
      <aside className={`side-menu ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">Optimización</h1>
          <button className="btn-close-sidebar" onClick={onToggle} title="Cerrar menú">
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* Búsqueda de Raíces */}
          <section className="method-section">
            <h3 className="section-title">Búsqueda de Raíces</h3>
            <ul className="method-list">
              {rootMethods.map(method => (
                <li key={method.id}>
                  <button
                    className={`method-btn ${activeMethod === method.id ? 'active' : ''}`}
                    onClick={() => onMethodSelect(method.id)}
                    title={method.description}
                  >
                    <span className="method-icon">∫</span>
                    <span className="method-name">{method.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Optimización 1D */}
          <section className="method-section">
            <h3 className="section-title">Optimización 1D</h3>
            <ul className="method-list">
              {optimizationMethods.map(method => (
                <li key={method.id}>
                  <button
                    className={`method-btn ${activeMethod === method.id ? 'active' : ''}`}
                    onClick={() => onMethodSelect(method.id)}
                    title={method.description}
                  >
                    <span className="method-icon">◇</span>
                    <span className="method-name">{method.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Optimización Multidimensional */}
          <section className="method-section">
            <h3 className="section-title">Optimización nD</h3>
            <ul className="method-list">
              {multidimensionalMethods.map(method => (
                <li key={method.id}>
                  <button
                    className={`method-btn ${activeMethod === method.id ? 'active' : ''}`}
                    onClick={() => onMethodSelect(method.id)}
                    title={method.description}
                  >
                    <span className="method-icon">●</span>
                    <span className="method-name">{method.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </nav>

        <div className="sidebar-footer">
          <p className="version-info">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}

export default SideMenu;
