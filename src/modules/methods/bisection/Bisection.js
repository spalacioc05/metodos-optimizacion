/**
 * BISECCIÓN - Implementación con generador para precisión incremental
 * Encontrar raíces dividiendo intervalos recursivamente
 */

export class BisectionMethod {
  constructor(fn, config = {}) {
    this.fn = fn;
    this.maxIterations = config.maxIterations || 10000;
    this.tolerance = config.tolerance || 1e-6;
  }

  solve(xl, xu, tolerance = null) {
    const tol = tolerance !== null ? tolerance : this.tolerance;
    const iterations = [];
    let iteration = 0;
    let left = xl;
    let right = xu;
    
    let xr = (left + right) / 2;
    let error = Math.abs(right - left);

    // Si tolerancia es 0, ejecutar hasta maxIterations; si no, hasta tolerancia
    while (iteration < this.maxIterations) {
      const fLeft = this.fn(left);
      const fRight = this.fn(right);
      const fXr = this.fn(xr);

      // Error relativo del intervalo
      error = Math.abs(right - left);

      iterations.push({
        iteration: iteration + 1,
        xl: parseFloat(left.toFixed(10)),
        xu: parseFloat(right.toFixed(10)),
        xr: parseFloat(xr.toFixed(10)),
        fxl: parseFloat(fLeft.toFixed(10)),
        fxu: parseFloat(fRight.toFixed(10)),
        fxr: parseFloat(fXr.toFixed(10)),
        error: parseFloat(error.toFixed(10)),
      });

      // Detener si alcanzó convergencia
      // Si tolerance es 0, buscar convergencia exacta (error muy pequeño)
      // Si tolerance > 0, detener cuando error <= tolerance
      const threshold = tol === 0 ? 1e-15 : tol;
      if (error <= threshold) {
        break;
      }

      // Actualizar el intervalo basado en cambio de signo
      if (fLeft * fXr < 0) {
        right = xr;
      } else {
        left = xr;
      }

      xr = (left + right) / 2;
      iteration++;
    }

    if (iterations.length === 0) {
      return {
        root: NaN,
        iterations: [],
        converged: false,
        error: 'No se generaron iteraciones',
        totalIterations: 0,
        message: 'No se generaron iteraciones',
      };
    }

    const finalIteration = iterations[iterations.length - 1];
    return {
      root: parseFloat(finalIteration.xr),
      iterations,
      converged: tol === 0 ? true : (error <= tol),
      finalError: error,
      totalIterations: iterations.length,
      message: tol === 0 ? `${iterations.length} iteraciones completadas` : (error <= tol ? 'Convergencia alcanzada' : 'Máximo de iteraciones alcanzado'),
    };
  }
}

export default BisectionMethod;
