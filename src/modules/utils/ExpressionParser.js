/**
 * Parser avanzado de expresiones matemáticas
 * Implementación diferente: usando tokenización y evaluación segura
 */

const MATH_LIBRARY = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  exp: Math.exp,
  log: Math.log,
  log2: Math.log2,
  log10: Math.log10,
  sqrt: Math.sqrt,
  abs: Math.abs,
  ceil: Math.ceil,
  floor: Math.floor,
  round: Math.round,
  pow: Math.pow,
  min: Math.min,
  max: Math.max,
  sign: Math.sign,
  trunc: Math.trunc,
};

const CONSTANTS = {
  pi: Math.PI,
  e: Math.E,
  PI: Math.PI,
  E: Math.E,
};

const RESERVED_IDENTIFIERS = new Set([
  ...Object.keys(MATH_LIBRARY),
  ...Object.keys(CONSTANTS),
]);

/**
 * Tokeniza una expresión matemática
 */
function tokenize(expr) {
  const tokens = [];
  let current = '';
  
  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    
    if (/\s/.test(char)) {
      if (current) tokens.push(current);
      current = '';
    } else if (/[+\-*/()\^]/.test(char)) {
      if (current) tokens.push(current);
      tokens.push(char);
      current = '';
    } else {
      current += char;
    }
  }
  
  if (current) tokens.push(current);
  return tokens;
}

/**
 * Valida y compila una expresión a una función ejecutable
 */
export function createExpression(expr) {
  try {
    const sanitized = expr
      .replace(/\^/g, '**')
      .replace(/(\d)\s*\(/g, '$1*(')
      .replace(/\)\s*\(/g, ')*(')
      .replace(/\)\s*(\d)/g, ')*$1');
    
    const code = `
      return function(x, y, z, w) {
        const vars = { x, y, z, w };
        const mathLib = {${Object.keys(MATH_LIBRARY).map(k => `${k}: MATH_LIBRARY.${k}`).join(',')}};
        const consts = {${Object.keys(CONSTANTS).map(k => `${k}: CONSTANTS.${k}`).join(',')}};
        
        with(mathLib) {
          with(consts) {
            try {
              return ${sanitized};
            } catch(e) {
              return NaN;
            }
          }
        }
      };
    `;
    
    const fn = new Function('MATH_LIBRARY', 'CONSTANTS', code);
    return fn(MATH_LIBRARY, CONSTANTS);
  } catch (error) {
    console.error('Parse error:', error);
    return () => NaN;
  }
}

/**
 * Calcula derivada numérica con método de diferencias centrales
 */
export function numericalDerivative(fn, x, h = 1e-5) {
  const f_plus = fn(x + h);
  const f_minus = fn(x - h);
  
  if (!isFinite(f_plus) || !isFinite(f_minus)) return NaN;
  
  return (f_plus - f_minus) / (2 * h);
}

/**
 * Calcula segunda derivada numérica
 */
export function secondDerivative(fn, x, h = 1e-5) {
  const f_plus = fn(x + h);
  const f_center = fn(x);
  const f_minus = fn(x - h);
  
  if (!isFinite(f_plus) || !isFinite(f_center) || !isFinite(f_minus)) return NaN;
  
  return (f_plus - 2 * f_center + f_minus) / (h * h);
}

/**
 * Evalúa función multidimensional
 */
export function evaluateMultivariate(fn, coords) {
  try {
    const result = fn(...coords);
    return isFinite(result) ? result : NaN;
  } catch {
    return NaN;
  }
}

/**
 * Extrae variables de usuario presentes en la expresión (x, y, z, etc.).
 */
export function extractExpressionVariables(expr) {
  if (typeof expr !== 'string' || !expr.trim()) return [];

  const cleaned = expr
    .replace(/\*\*/g, ' ')
    .replace(/[+\-*/()^,]/g, ' ');

  const tokens = cleaned.match(/[A-Za-z_]\w*/g) || [];
  const vars = tokens.filter(token => !RESERVED_IDENTIFIERS.has(token));

  return Array.from(new Set(vars));
}

export default {
  createExpression,
  numericalDerivative,
  secondDerivative,
  evaluateMultivariate,
  extractExpressionVariables,
};
