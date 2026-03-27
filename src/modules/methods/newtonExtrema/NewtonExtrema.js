/**
 * NEWTON PARA EXTREMA - Encontrar máximos y mínimos
 * Implementación con test de segunda derivada
 */

import { numericalDerivative, secondDerivative } from '../../utils/ExpressionParser';

export class NewtonExtremaMethod {
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
      const fpn = numericalDerivative(this.fn, xn, this.stepSize);
      const fppn = secondDerivative(this.fn, xn, this.stepSize);

      if (Math.abs(fppn) < 1e-15) {
        return {
          root: NaN,
          iterations,
          converged: false,
          error: 'Segunda derivada muy cercana a cero',
          totalIterations: iterations.length,
        };
      }

      const xNext = xn - fpn / fppn;
      error = Math.abs(xNext - xn);

      // Determinar tipo de extremo
      const extremeType = fppn > 0 ? 'Mínimo' : 'Máximo';
      const fxn = this.fn(xn);

      iterations.push({
        iteration: iteration + 1,
        xn: parseFloat(xn.toFixed(10)),
        fxn: parseFloat(fxn.toFixed(10)),
        fpn: parseFloat(fpn.toFixed(10)),
        fppn: parseFloat(fppn.toFixed(10)),
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

    const finalIteration = iterations[iterations.length - 1];
    const fxFinal = this.fn(finalIteration.xNext);
    const extremeType = (secondDerivative(this.fn, finalIteration.xNext, this.stepSize) > 0) ? 'Mínimo' : 'Máximo';

    return {
      root: parseFloat(finalIteration.xNext),
      extremum: parseFloat(finalIteration.xNext),
      optimalValue: parseFloat(fxFinal.toFixed(10)),
      extremumType: extremeType,
      iterations,
      converged: tol === 0 ? true : (error <= tol),
      finalError: error,
      totalIterations: iterations.length,
      message: tol === 0 ? `${iterations.length} iteraciones completadas` : (error <= tol ? 'Convergencia alcanzada' : 'Máximo de iteraciones'),
    };
  }
}

export default NewtonExtremaMethod;
