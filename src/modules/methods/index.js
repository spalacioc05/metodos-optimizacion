/**
 * Índice centralizado de métodos
 */

export { BisectionMethod } from './bisection/Bisection';
export { FalsePositionMethod } from './falsePosition/FalsePosition';
export { QuadraticInterpolationMethod } from './quadraticInterpolation/QuadraticInterpolation';
export { NewtonRaphsonMethod } from './newtonRaphson/NewtonRaphson';
export { NewtonExtremaMethod } from './newtonExtrema/NewtonExtrema';
export { GoldenRatioMethod } from './goldenRatio/GoldenRatio';
export { RandomSearchMethod } from './randomSearch/RandomSearch';

/**
 * Metadatos de métodos para UI
 */
export const METHOD_CONFIGS = {
  bisection: {
    id: 'bisection',
    name: 'Bisección',
    category: 'root',
    description: 'División del intervalo por mitades',
    parameters: [
      { name: 'xl', label: 'Límite inferior (a)', type: 'number', required: true },
      { name: 'xu', label: 'Límite superior (b)', type: 'number', required: true },
      { name: 'tolerance', label: 'Tolerancia', type: 'number', defaultValue: 0.001, required: true },
    ],
  },
  falsePosition: {
    id: 'falsePosition',
    name: 'Falsa Posición',
    category: 'root',
    description: 'Interpolación lineal en lugar de punto medio',
    parameters: [
      { name: 'xl', label: 'Límite inferior (a)', type: 'number', required: true },
      { name: 'xu', label: 'Límite superior (b)', type: 'number', required: true },
      { name: 'tolerance', label: 'Tolerancia', type: 'number', defaultValue: 0.001, required: true },
    ],
  },
  quadraticInterpolation: {
    id: 'quadraticInterpolation',
    name: 'Interpolación Cuadrática',
    category: 'root',
    description: 'Interpolación polinómica de segundo grado',
    parameters: [
      { name: 'x0', label: 'Punto 1', type: 'number', required: true },
      { name: 'x1', label: 'Punto 2', type: 'number', required: true },
      { name: 'x2', label: 'Punto 3', type: 'number', required: true },
      { name: 'tolerance', label: 'Tolerancia', type: 'number', defaultValue: 0.001, required: true },
    ],
  },
  newtonRaphson: {
    id: 'newtonRaphson',
    name: 'Newton-Raphson (Raíces)',
    category: 'root',
    description: 'Encuentra raíces usando derivada',
    parameters: [
      { name: 'x0', label: 'Estimación inicial', type: 'number', required: true },
      { name: 'tolerance', label: 'Tolerancia', type: 'number', defaultValue: 0.001, required: true },
      { name: 'maxIterations', label: 'Máximo iteraciones', type: 'number', defaultValue: 1000, required: true },
    ],
  },
  newtonExtrema: {
    id: 'newtonExtrema',
    name: 'Newton (Máximos/Mínimos)',
    category: 'optimization',
    description: 'Encuentra extrema locales',
    parameters: [
      { name: 'x0', label: 'Estimación inicial', type: 'number', required: true },
      { name: 'tolerance', label: 'Tolerancia', type: 'number', defaultValue: 0.001, required: true },
      { name: 'maxIterations', label: 'Máximo iteraciones', type: 'number', defaultValue: 1000, required: true },
    ],
  },
  goldenRatio: {
    id: 'goldenRatio',
    name: 'Razón Dorada',
    category: 'optimization',
    description: 'Optimización unimodal usando sección dorada',
    parameters: [
      { name: 'xl', label: 'Límite inferior', type: 'number', required: true },
      { name: 'xu', label: 'Límite superior', type: 'number', required: true },
      { name: 'tolerance', label: 'Tolerancia', type: 'number', defaultValue: 0.001, required: true },
    ],
  },
  randomSearch: {
    id: 'randomSearch',
    name: 'Búsqueda Aleatoria',
    category: 'multidimensional',
    description: 'Optimización multidimensional estocástica',
    parameters: [
      { name: 'xl', label: 'X mínimo', type: 'number', defaultValue: -10, required: true },
      { name: 'xu', label: 'X máximo', type: 'number', defaultValue: 10, required: true },
      { name: 'yl', label: 'Y mínimo', type: 'number', defaultValue: -10, required: true },
      { name: 'yu', label: 'Y máximo', type: 'number', defaultValue: 10, required: true },
      { name: 'zl', label: 'Z mínimo (opcional)', type: 'number', defaultValue: -300, required: false },
      { name: 'zu', label: 'Z máximo (opcional)', type: 'number', defaultValue: 50, required: false },
      { name: 'samples', label: 'Número de muestras', type: 'number', defaultValue: 10000, required: true },
    ],
  },
};

export default METHOD_CONFIGS;
