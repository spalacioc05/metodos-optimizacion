/**
 * INTERPOLACIÓN CUADRÁTICA - Usando matriz de Lagrange
 */

export class QuadraticInterpolationMethod {
  constructor(fn, config = {}) {
    this.fn = fn;
    this.maxIterations = config.maxIterations || 10000;
    this.tolerance = config.tolerance || 1e-6;
  }

  solve(x0, x1, x2, tolerance = null) {
    const tol = tolerance !== null ? tolerance : this.tolerance;
    const iterations = [];
    let iteration = 0;
    const maxIter = this.maxIterations;

    let xn_2 = x0, xn_1 = x1, xn = x2;
    let error = Infinity;

    // Si tolerancia es 0, ejecutar hasta maxIterations; si no, hasta tolerancia
    while (iteration < maxIter) {
      const fn_2 = this.fn(xn_2);
      const fn_1 = this.fn(xn_1);
      const fn = this.fn(xn);

      // Estimación mediante diferencias divididas (método de Müller simplificado)
      const h0 = xn_1 - xn_2;
      const h1 = xn - xn_1;
      const d0 = (fn_1 - fn_2) / h0;
      const d1 = (fn - fn_1) / h1;
      const a = (d1 - d0) / (h1 + h0);
      const b = d1 + a * h1;

      // Nueva aproximación
      let xNext = xn;
      if (Math.abs(b) > 1e-15) {
        const discriminant = b * b - 2 * a * fn;
        if (discriminant >= 0) {
          const sqrtDisc = Math.sqrt(discriminant);
          xNext = xn - 2 * fn / (b + (b >= 0 ? sqrtDisc : -sqrtDisc));
        }
      }

      const fNext = this.fn(xNext);
      error = Math.abs(xNext - xn);

      iterations.push({
        iteration: iteration + 1,
        x0: parseFloat(xn_2.toFixed(10)),
        x1: parseFloat(xn_1.toFixed(10)),
        x2: parseFloat(xn.toFixed(10)),
        xr: parseFloat(xNext.toFixed(10)),
        fx0: parseFloat(fn_2.toFixed(10)),
        fx1: parseFloat(fn_1.toFixed(10)),
        fx2: parseFloat(fn.toFixed(10)),
        fxr: parseFloat(fNext.toFixed(10)),
        error: parseFloat(error.toFixed(10)),
      });

      // Detener si alcanzó convergencia
      // Si tolerance es 0, buscar convergencia exacta (error muy pequeño)
      // Si tolerance > 0, detener cuando error <= tolerance
      const threshold = tol === 0 ? 1e-15 : tol;
      if (error <= threshold) {
        break;
      }

      xn_2 = xn_1;
      xn_1 = xn;
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

export default QuadraticInterpolationMethod;
