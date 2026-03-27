# 🚀 OptiSarai - Nueva Plataforma de Métodos Numéricos

## 📝 Descripción del Proyecto

Este es un **rediseño completo** de la plataforma original ubicada en `MetodosOptimizacion`. Se ha desarrollado una nueva interfaz modular en la carpeta `PaginaMetodosOpti` con:

### ✨ Características Principales

#### **7 Métodos Numéricos Implementados**
1. **Bisección** - División de intervalos
2. **Falsa Posición** - Interpolación lineal
3. **Interpolación Cuadrática** - Usando matriz de Lagrange
4. **Newton-Raphson (Raíces)** - Con derivada numérica
5. **Newton (Extrema)** - Máximos y mínimos
6. **Razón Dorada** - Optimización unimodal
7. **Búsqueda Aleatoria** - Optimización multidimensional (2D/3D)

#### **Interfaz Moderna**
- 🎨 **Tema Claro** con gradientes azul-verde
- 📱 **Responsive Design** - Funciona en móvil y desktop
- 🎛️ **Menú lateral** hamburguesa para selección de métodos
- ⌨️ **Editor de funciones avanzado** con barra de símbolos matemáticos
- 📊 **Gráficas interactivas** (Chart.js)
- 📋 **Tabla de iteraciones** expandible
- 🎯 **Resumen visual** de resultados

#### **Tipografía Matemática**
- Fuente similar a LaTeX/Robótica Math
- Símbolos especiales: sin, cos, log, √, π, etc.
- Soporta: potencias (^), funciones trigonométricas, logarítmicas

---

## 🗂️ Estructura de Carpetas

```
PaginaMetodosOpti/
├── src/
│   ├── modules/
│   │   ├── methods/           # Métodos implementados modularmente
│   │   │   ├── bisection/
│   │   │   ├── falsePosition/
│   │   │   ├── quadraticInterpolation/
│   │   │   ├── newtonRaphson/
│   │   │   ├── newtonExtrema/
│   │   │   ├── goldenRatio/
│   │   │   ├── randomSearch/
│   │   │   └── index.js       # Exportador centralizado
│   │   ├── components/        # Componentes React
│   │   │   ├── App.jsx        # Componente principal
│   │   │   ├── SideMenu.jsx   # Menú lateral
│   │   │   ├── MethodPanel.jsx # Panel del método seleccionado
│   │   │   ├── FunctionInput.jsx # Editor de funciones
│   │   │   ├── ParametersInput.jsx # Entrada de parámetros
│   │   │   ├── ResultsVisualization.jsx # Gráficas
│   │   │   └── IterationsTable.jsx # Tabla de iteraciones
│   │   ├── utils/
│   │   │   └── ExpressionParser.js # Parser y evaluador de funciones
│   │   ├── styles/           # Estilos CSS
│   │   │   ├── global.css    # Variables CSS y tema
│   │   │   ├── app.css
│   │   │   ├── sideMenu.css
│   │   │   ├── methodPanel.css
│   │   │   ├── functionInput.css
│   │   │   ├── parametersInput.css
│   │   │   ├── resultsVisualization.css
│   │   │   └── iterationsTable.css
│   │   └── hooks/            # Custom React hooks (extensible)
│   ├── App.jsx               # Raíz de componentes
│   ├── main.jsx              # Punto de entrada
│   └── index.css
├── package.json
└── vite.config.js
```

---

## 🔄 Diferencias con la Implementación Original

### **Métodos (Rediseñados)**

| Método | Original (MetodosOptimizacion) | Nuevo (PaginaMetodosOpti) |
|--------|--------------------------------|---------------------------|
| **Bisección** | Loops tradicionales | Generador (yield) para precisión incremental |
| **Falsa Posición** | Iteración simple | Validación robusta de cambio de signo |
| **Interpolación Cuadrática** | Interpolación lineal | Matriz de Lagrange (mayor precisión) |
| **Newton-Raphson** | Derivada analítica | Derivada numérica automática |
| **Newton (Extrema)** | Búsqueda directa | Test de segunda derivada integrado |
| **Razón Dorada** | Estado local | Acumulador de resultados |
| **Búsqueda Aleatoria** | Muestreo simple | Muestreo estratificado con seed reproducible |

### **Arquitectura**

- **Métodos:**  Clases con constructor configurable vs funciones exportadas
- **Componentes:** Modularidad refinada, separación clara de responsabilidades
- **Estilos:** CSS modular por componente vs archivo único
- **Estado:** Hooks de React optimizados

---

## 🎯 Funcionalidad por Categoría

### **Entrada de Funciones**
```javascript
Símbolos disponibles: 
- Trigonométricas: sin(x), cos(x), tan(x), asin, acos, atan
- Hiperbólicas: sinh(x), cosh(x), tanh(x)
- Logarítmicas: log(x), log2(x), log10(x), exp(x)
- Especiales: sqrt(x), abs(x), π, e
- Potencias: x^2, x^3, x^n
```

### **Parámetros por Método**

**Bisección/Falsa Posición/Razón Dorada:**
- Límite inferior (xl)
- Límite superior (xu)
- Tolerancia

**Newton-Raphson/Newton (Extrema):**
- Estimación inicial (x0)
- Tolerancia
- Máximo de iteraciones

**Interpolación Cuadrática:**
- Tres puntos iniciales (x0, x1, x2)
- Tolerancia

**Búsqueda Aleatoria:**
- Límites X, Y (y Z opcional)
- Número de muestras

---

## 🚀 Uso y Ejecución

### **Instalación**
```bash
cd PaginaMetodosOpti
npm install
```

### **Desarrollo**
```bash
npm run dev
# Abre http://localhost:5179
```

### **Producción**
```bash
npm run build
npm run preview
```

---

## 📊 Visualizaciones

- **Gráficos interactivos** con Chart.js
- **Convergencia**: Aproximación vs límites
- **Error**: Escala logarítmica (log₁₀)
- **Distribución 2D**: Para búsqueda aleatoria
- **Tabla expandible** con datos de cada iteración

---

## ✅ Validaciones Integradas

- ✓ Función inválida → mostrar error
- ✓ Parámetros incompletos → aviso
- ✓ Cambio de signo faltante → detección automática
- ✓ Derivada cercana a cero → manejo de excepciones
- ✓ Convergencia no lograda → notificación clara

---

## 🎨 Diseño Visual

- **Fondo:** Gradiente claro (#f8f9fa → #e8f0fe)
- **Acentos:** Azul (#0066cc) y Verde (#00a878)
- **Tipografía:** Inter (UI) + Courier New (Math)
- **Transiciones:** Suave (0.3s ease)
- **Sombras:** Sutiles para profundidad

---

## 📈 Próximas Mejoras (Opcionales)

- [ ] Exportar resultados a PDF/CSV
- [ ] Comparación visual entre métodos
- [ ] Presets de funciones populares
- [ ] Modo oscuro
- [ ] Análisis de convergencia mejorado
- [ ] WebWorkers para búsqueda aleatoria masiva
- [ ] Métodos adicionales (Gradient Descent, BFGS)
- [ ] Tests automatizados

---

## 📝 Notas de Desarrollo

- Todos los métodos tienen configuración modular
- Parser de expresiones seguro (Function + contexto aislado)
- Derivadas numéricas automáticas (h = 1e-5)
- Compatible con variables x, y, z, w
- Manejo robusto de NaN e Infinity

**Versión:** 1.0.0  
**Fecha:** Marzo 27, 2026  
**Desarrollador:** OptiSarai Team
