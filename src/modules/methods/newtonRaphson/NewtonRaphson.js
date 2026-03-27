/**
 * NEWTON-RAPHSON PARA RAÍCES - Implementación con matriz jacobiana aproximada
 */

import { numericalDerivative } from '../../utils/ExpressionParser';

export class NewtonRaphsonMethod {
  constructor(fn, config = {}) {
    this.fn = fn;
    this.maxIterations = config.maxIterations || 1000;
    this.tolerance = config.tolerance || 1e-6;
    this.stepSize = config.stepSize || 1e-5;
  }

  solve(x0, tolerance = null) {
    const tol = tolerance !== null ? tolerance : this.tolerance;
    const iterations = [];
    let iteration = 0;
    let xn = x0;
    let error = Infinity;

    // Si tolerancia es 0, ejecutar hasta maxIterations; si no, hasta tolerancia
    while (iteration < this.maxIterations) {
      const fn = this.fn(xn);
      const fpn = numericalDerivative(this.fn, xn, this.stepSize);

      if (Math.abs(fpn) < 1e-15) {
        if (iterations.length === 0) {
          return {
            root: NaN,
            iterations: [],
            converged: false,
            error: 'Derivada muy cercana a cero',
            totalIterations: 0,
          };
        }
        break;
      }

      const xNext = xn - fn / fpn;
      error = Math.abs(xNext - xn);

      iterations.push({
        iteration: iteration + 1,
        xn: parseFloat(xn.toFixed(10)),
        fxn: parseFloat(fn.toFixed(10)),
        fpn: parseFloat(fpn.toFixed(10)),
        xNext: parseFloat(xNext.toFixed(10)),
        error: parseFloat(error.toFixed(10)),
      });

      // Detener si alcanzó convergencia
      // Si tolerance es 0, buscar convergencia exacta (error muy pequeño)
      // Si tolerance > 0, detener cuando error <= tolerance
      const threshold = tol === 0 ? 1e-15 : tol;
      if (error <= threshold) {
        break;
      }

      xn = xNext;
      iteration++;
    }

    if (iterations.length === 0) {
      return {
        root: NaN,
        iterations: [],
        converged: false,
        error: 'No se generaron iteraciones',
        totalIterations: 0,
      };
    }

    const finalIteration = iterations[iterations.length - 1];
    return {
      root: parseFloat(finalIteration.xNext),
      iterations,
      converged: tol === 0 ? true : (error <= tol),
      finalError: error,
      totalIterations: iterations.length,
      message: tol === 0 ? `${iterations.length} iteraciones completadas` : (error <= tol ? 'Convergencia alcanzada' : 'Máximo de iteraciones'),
    };
  }
}

export default NewtonRaphsonMethod;
