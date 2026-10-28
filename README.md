# Data Sources Automation (DSA) - CADIT UNIMINUTO 📊

Plataforma integral para el monitoreo, automatización, ejecución de pipelines ETL y documentación de fuentes de datos institucionales de la **Corporación Universitaria Minuto de Dios (UNIMINUTO)**, desarrollada para la unidad **CADIT**.

---

## 🏛️ Identidad Visual Institucional UNIMINUTO

El diseño respeta y aplica rigurosamente la paleta y contrastes oficiales:
- **Azul Marino (`#0A1C3D`):** Encabezados, barras de navegación y fondos de alto contraste.
- **Amarillo (`#FFC000`):** Botones de acción principal (*"Actualizar Ahora"*, texto negro para máxima legibilidad según WCAG).
- **Rojo (`#E30613`):** Alertas, fuentes en fallo o caídas.
- **Verde (`#00A859`):** Estado exitoso (*"Al día"*), sincronizaciones correctas.
- **Fondo General (`bg-gray-50`):** Fondo neutro para visualización prolongada sin fatiga visual.

---

## 🗂️ Estructura de Carpetas por Fuente de Datos

Cada fuente de datos (ej. `ICETEX`, `DANE`, `SABER_PRO`) cuenta con su estructura local normalizada:

```
fuentes/
└── [NOMBRE_FUENTE]/
    ├── Archivos/       # Descargas crudas (CSV, XLSX, PDF) inmutables
    ├── Diccionarios/   # Diccionario de datos en Markdown (DICCIONARIO_[FUENTE].md)
    ├── ETL/            # Scripts de transformación y bitácoras de auditoría (etl_execution.log)
    ├── Guia/           # Archivo de control LEEME.txt y DESCRIPCION_GENERAL_[FUENTE].md
    └── Procesados/     # Datos limpios y consolidados listos para ingesta en Power BI
```

---

## ⚙️ Flujo Automatizado de 5 Pasos

Al pulsar **"Actualizar Ahora"** en el Dashboard:
1. **Descarga:** Ingesta del archivo fuente o consumo de API hacia `Archivos/`.
2. **ETL:** Ejecución de reglas de negocio, limpieza de nulos y estandarización hacia `Procesados/` con registro en `ETL/`.
3. **Diccionario:** Generación / actualización técnica del diccionario de campos en `Diccionarios/`.
4. **LEEME:** Actualización del archivo de versión y estado `Guia/LEEME.txt`.
5. **Descripción General:** Regeneración de la ficha técnica ejecutiva `Guia/DESCRIPCION_GENERAL_[FUENTE].md`.

---

## 🚀 Puesta en Marcha

### Prerrequisitos
- **Node.js:** v18.17+ o v20+ / v22+
- **Python:** 3.10+

### 1. Iniciar Frontend (Next.js Dashboard)
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```
Accede en tu navegador a: **`http://localhost:3000`**

### 2. Ejecutar el Orquestador de Python directamente (CLI)
```bash
# Probar con ICETEX
python orquestador.py ICETEX

# Probar con DANE
python orquestador.py DANE
```

---

## 🔌 Arquitectura de Integración (Next.js ↔ Python)

En el endpoint `app/api/update/route.ts` se implementan dos modalidades:
1. **Ejecución Local (`child_process.execFile`):** El backend de Next.js ejecuta directamente el script `orquestador.py` en el host, capturando `stdout` y códigos de salida.
2. **Modo Microservicio (FastAPI/Celery):** Preparado con código de ejemplo documentado para desacoplar el procesamiento pesado en un contenedor o servidor independiente.
