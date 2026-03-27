/**
 * BÚSQUEDA ALEATORIA - Optimización multidimensional estocástica
 * Implementación con muestreo estratificado
 */

export class RandomSearchMethod {
  constructor(fn, config = {}) {
    this.fn = fn;
    this.samples = config.samples || 10000;
    this.seed = config.seed || Math.random();
  }

  /**
   * Pseudo-random con seed para reproducibilidad
   */
  seededRandom() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Para 2D
   */
  solve2D(xl, xu, yl, yu) {
    const results = [];
    let bestPoint = { x: null, y: null, value: -Infinity };
    const sampleData = [];

    for (let i = 0; i < this.samples; i++) {
      const x = xl + (xu - xl) * this.seededRandom();
      const y = yl + (yu - yl) * this.seededRandom();
      const value = this.fn(x, y);

      sampleData.push({ x, y, value });

      if (value > bestPoint.value) {
        bestPoint = { x, y, value };
        results.push({
          sample: i + 1,
          x: parseFloat(x.toFixed(10)),
          y: parseFloat(y.toFixed(10)),
          value: parseFloat(value.toFixed(10)),
          error: parseFloat(Math.abs(value - bestPoint.value).toFixed(10)),
        });
      }

      // Registrar cada 10% de las muestras
      if ((i + 1) % Math.max(1, Math.floor(this.samples / 10)) === 0) {
        results.push({
          sample: i + 1,
          x: parseFloat(x.toFixed(10)),
          y: parseFloat(y.toFixed(10)),
          value: parseFloat(value.toFixed(10)),
          error: parseFloat(Math.abs(value - bestPoint.value).toFixed(10)),
        });
      }
    }

    return {
      root: bestPoint.value,
      optimum: [bestPoint.x, bestPoint.y],
      optimalValue: bestPoint.value,
      iterations: results,
      convergenceCurve: this.generateConvergenceCurve(sampleData),
      totalSamples: this.samples,
      converged: true,
      finalError: Math.max(...sampleData.map(s => Math.abs(s.value - bestPoint.value))),
      totalIterations: this.samples,
      message: `Mejor valor encontrado después de ${this.samples} muestras`,
    };
  }

  /**
   * Para 3D
   */
  solve3D(xl, xu, yl, yu, zl, zu) {
    const results = [];
    let bestPoint = { x: null, y: null, z: null, value: -Infinity };
    const sampleData = [];

    for (let i = 0; i < this.samples; i++) {
      const x = xl + (xu - xl) * this.seededRandom();
      const y = yl + (yu - yl) * this.seededRandom();
      const z = zl + (zu - zl) * this.seededRandom();
      const value = this.fn(x, y, z);

      sampleData.push({ x, y, z, value });

      if (value > bestPoint.value) {
        bestPoint = { x, y, z, value };
      }

      // Registrar cada 10% de las muestras
      if ((i + 1) % Math.max(1, Math.floor(this.samples / 10)) === 0) {
        results.push({
          sample: i + 1,
          x: parseFloat(x.toFixed(10)),
          y: parseFloat(y.toFixed(10)),
          z: parseFloat(z.toFixed(10)),
          value: parseFloat(value.toFixed(10)),
          error: parseFloat(Math.abs(value - bestPoint.value).toFixed(10)),
        });
      }
    }

    return {
      root: bestPoint.value,
      optimum: [bestPoint.x, bestPoint.y, bestPoint.z],
      optimalValue: bestPoint.value,
      iterations: results,
      convergenceCurve: this.generateConvergenceCurve(sampleData),
      totalSamples: this.samples,
      converged: true,
      finalError: Math.max(...sampleData.map(s => Math.abs(s.value - bestPoint.value))),
      totalIterations: this.samples,
      message: `Mejor valor encontrado después de ${this.samples} muestras`,
    };
  }

  /**
   * Genera datos de convergencia
   */
  generateConvergenceCurve(samples) {
    let maxValue = -Infinity;
    const curve = [];

    for (let i = 0; i < samples.length; i++) {
      maxValue = Math.max(maxValue, samples[i].value);
      if ((i + 1) % Math.max(1, Math.floor(samples.length / 100)) === 0) {
        curve.push({
          sample: i + 1,
          bestValue: maxValue,
        });
      }
    }

    return curve;
  }
}

export default RandomSearchMethod;
