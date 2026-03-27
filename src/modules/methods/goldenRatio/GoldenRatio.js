/**
 * RAZÓN DORADA - Optimización mediante sección dorada
 * Implementación con estado acumulativo
 */

export class GoldenRatioMethod {
  constructor(fn, config = {}) {
    this.fn = fn;
    this.tolerance = config.tolerance || 1e-6;
    this.maxIterations = config.maxIterations || 10000;
    this.phi = (Math.sqrt(5) - 1) / 2; // ≈ 0.618
  }

  solve(xl, xu, tolerance = null) {
    const tol = tolerance !== null ? tolerance : this.tolerance;
    const iterations = [];
    let iteration = 0;
    let left = xl;
    let right = xu;
    let error = Math.abs(right - left);

    // Puntos iniciales
    let d = this.phi * (right - left);
    let x1 = left + d;
    let x2 = right - d;
    let fx1 = this.fn(x1);
    let fx2 = this.fn(x2);

    // Si tolerancia es 0, ejecutar hasta maxIterations; si no, hasta tolerancia
    while (iteration < this.maxIterations) {
      error = Math.abs(right - left);

      iterations.push({
        iteration: iteration + 1,
        left: parseFloat(left.toFixed(10)),
        right: parseFloat(right.toFixed(10)),
        x1: parseFloat(x1.toFixed(10)),
        x2: parseFloat(x2.toFixed(10)),
        fx1: parseFloat(fx1.toFixed(10)),
        fx2: parseFloat(fx2.toFixed(10)),
        error: parseFloat(error.toFixed(10)),
      });

      // Detener si alcanzó convergencia
      // Si tolerance es 0, buscar convergencia exacta (error muy pequeño)
      // Si tolerance > 0, detener cuando error <= tolerance
      const threshold = tol === 0 ? 1e-15 : tol;
      if (error <= threshold) {
        break;
      }

      // Estrategia: mantener el valor más alto
      if (fx2 > fx1) {
        left = x1;
        x1 = x2;
        fx1 = fx2;
        d = this.phi * (right - left);
        x2 = right - d;
        fx2 = this.fn(x2);
      } else {
        right = x2;
        x2 = x1;
        fx2 = fx1;
        d = this.phi * (right - left);
        x1 = left + d;
        fx1 = this.fn(x1);
      }

      iteration++;
    }

    const optimum = (left + right) / 2;
    const optimalValue = this.fn(optimum);

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

    return {
      root: parseFloat(optimum.toFixed(10)),
      optimum: parseFloat(optimum.toFixed(10)),
      optimalValue: parseFloat(optimalValue.toFixed(10)),
      iterations,
      converged: tol === 0 ? true : (error <= tol),
      finalError: error,
      totalIterations: iterations.length,
      message: tol === 0 ? `${iterations.length} iteraciones completadas` : (error <= tol ? 'Convergencia alcanzada' : 'Máximo de iteraciones'),
    };
  }
}

export default GoldenRatioMethod;
