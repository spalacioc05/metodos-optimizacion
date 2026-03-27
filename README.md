# Metodos de Optimizacion

Aplicacion web interactiva desarrollada para la materia de **Optimizacion** de **Santiago Palacio Cardenas**.

El proyecto reune metodos numericos clasicos para:

- Buscar raices de funciones.
- Resolver problemas de optimizacion en una variable.
- Explorar optimizacion multidimensional con busqueda estocastica.

## Sitio publicado

La aplicacion ya esta desplegada y lista para uso en:

**https://metodos-optimizacion-ten.vercel.app/**

## Que hace este programa

Esta herramienta permite ingresar una funcion matematica, configurar parametros del metodo y ejecutar iteracion por iteracion.

Incluye:

- Entrada de funciones en formato texto.
- Panel de parametros por metodo.
- Tabla de iteraciones para analizar convergencia.
- Visualizacion de resultados con graficas.

## Metodos implementados

### 1) Busqueda de raices

#### Biseccion

- Divide el intervalo en mitades sucesivas.
- Requiere cambio de signo en los extremos.
- Es robusto y facil de interpretar.

Parametros:

- Limite inferior `a`.
- Limite superior `b`.
- Tolerancia.

#### Falsa Posicion

- Usa interpolacion lineal para estimar la raiz.
- Tambien requiere cambio de signo en el intervalo.
- Suele converger mas rapido que biseccion en algunos casos.

Parametros:

- Limite inferior `a`.
- Limite superior `b`.
- Tolerancia.

#### Interpolacion Cuadratica

- Construye un polinomio cuadratico con tres puntos.
- Aproxima la raiz con una estimacion de mayor curvatura local.
- Util para problemas donde una aproximacion parabola mejora el avance.

Parametros:

- Punto inicial `x0`.
- Punto inicial `x1`.
- Punto inicial `x2`.
- Tolerancia.

#### Newton-Raphson (Raices)

- Metodo abierto basado en derivada.
- Muy eficiente cerca de la solucion.
- Sensible a la estimacion inicial y a derivadas cercanas a cero.

Parametros:

- Estimacion inicial `x0`.
- Tolerancia.
- Maximo de iteraciones.

### 2) Optimizacion 1D

#### Newton para maximos/minimos

- Busca puntos criticos usando primera y segunda derivada.
- Permite aproximar extremos locales rapidamente.
- Requiere buena condicion local para converger de forma estable.

Parametros:

- Estimacion inicial `x0`.
- Tolerancia.
- Maximo de iteraciones.

#### Razon Dorada

- Metodo de optimizacion unimodal en intervalos.
- Reduce progresivamente la region de busqueda.
- No requiere derivadas explicitas.

Parametros:

- Limite inferior.
- Limite superior.
- Tolerancia.

### 3) Optimizacion multidimensional

#### Busqueda Aleatoria

- Metodo estocastico por muestreo de puntos.
- Explora dominios en 2D y 3D.
- Adecuado para funciones complejas o no suaves.

Parametros principales:

- Rango de `x` (min y max).
- Rango de `y` (min y max).
- Rango opcional de `z` para modo 3D.
- Numero de muestras.

## Tecnologias

- React + Vite.
- Chart.js y react-chartjs-2 para graficas 2D.
- Plotly para visualizacion 3D.

## Ejecucion local

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar en desarrollo:

```bash
npm run dev
```

3. Generar build de produccion:

```bash
npm run build
```

4. Previsualizar build:

```bash
npm run preview
```

## Objetivo academico

Este proyecto fue construido como apoyo practico para estudiar el comportamiento de metodos numericos de optimizacion, comparar su convergencia y fortalecer la comprension teorica con experimentacion computacional.

---

Desarrollado para la materia de **Optimizacion** de **Santiago Palacio Cardenas**.
