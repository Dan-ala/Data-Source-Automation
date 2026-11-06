# Data Sources Automation (DSA) — CADIT UNIMINUTO 📊

Plataforma oficial para el monitoreo, catalogación de metadatos, visualización de diccionarios técnicos y automatización de fuentes de datos de la **Unidad CADIT** (*Conocimiento, Analítica, Datos, IA y Transformación Digital*) perteneciente a la **Vicerrectoría Académica (VAC)** y la **Oficina de Estudios y Diseños Estratégicos (OEDE)** de **UNIMINUTO**.

> 💡 **Para consultar el desglose completo de directorios, archivos, componentes y fuentes:**  
> Revisa el documento [CONTEXTO_PROYECTO.md](./CONTEXTO_PROYECTO.md) en la raíz del repositorio.

---

## 🏛️ Identidad de Marca CADIT UNIMINUTO
- **Símbolo:** Búho en Pixel Art posado sobre la franja amarilla institucional.
- **Tipografía:** `IBM Plex Sans` (Google Fonts).
- **Paleta de Colores:**
  - **Azul CADIT (`#004A93`):** Encabezados, botones primarios y categoría Educación.
  - **Amarillo UNIMINUTO (`#FFD300`):** Franja inferior de acento, alertas de actualización y badges.
  - **Azul Marino (`#212844`):** Textos principales, contornos y botones de contraste.
  - **Fondo Niebla (`#F3F6FB`):** Superficie de trabajo descansada para análisis de datos.

---

## 🗂️ Modelo de Ingesta (Directo y Solo Lectura)
La plataforma se conecta directamente al repositorio de red institucional:
`C:\Users\danie\uniminuto.edu\G- Storage OEDE - VAC - FUENTES_T`

- **Sin duplicación:** Ningún archivo de datos masivo se descarga o copia localmente.
- **Lectura en tiempo real:** Las rutas API analizan metadatos, mtimes y documentos Markdown (`LEEME`, `Diccionarios`) al vuelo.

---

## 🎨 Las 6 Categorías Oficiales y sus 36 Fuentes

| Categoría | Color | Descripción | Fuentes Incluidas |
| :--- | :--- | :--- | :--- |
| 🔵 **Educación** | `border-blue-600` | Sistema universitario, calidad, deserción y evaluaciones | ICETEX, OLE, SINEB, SNIES, SPADIES, CNA - Acreditación, ICFES (Saber Pro, Saber 11, Saber TyT, Pre Saber, Saber 3° 5° 9°), SENA, MINCIENCIAS, Educación Superior Latam |
| 🌸 **Rosado** | `border-pink-500` | Demografía, competitividad, empresas e impuestos | DANE (GEIH, Censo, PIB, Pobreza), DIAN, IDC, IDIC, RUES, Estadísticas Vitales, GeoportalDANE, INEGI México |
| 🟢 **Verde** | `border-emerald-500` | Inversión regional, contratación estatal y TIC | SGR (Regalías), SECOP, MINTIC, PATENTES_SIC |
| 🔴 **Rojo** | `border-rose-500` | Planeación territorial e instrumentos de desarrollo | TerriData, Planes de Desarrollo |
| 🟠 **Naranja** | `border-orange-500` | Empleabilidad, convocatorias públicas y tendencias | Servicio Público de Empleo, SIMO (CNSC), Google Trends |
| 💧 **Celeste** | `border-sky-400` | Salud pública y dinamismo turístico | REPS (Minsalud), Registro Nacional de Turismo |

---

## ⚙️ Estructura Homologada por Fuente (5 Pasos)
Cada fuente en el almacenamiento OEDE está normalizada con:
1. `Archivos/` — Descargas brutas inmutables (CSV, XLSX, PDF, APIs).
2. `ETL/` — Scripts de transformación, reglas de homologación y bitácoras de auditoría.
3. `Diccionarios/` — Diccionario de datos en Markdown (`DICCIONARIO_*.md`).
4. `Guia/` — Instrucciones de control `LEEME.txt` y fichas ejecutivas `DESCRIPCION_GENERAL_*.md`.
5. `Procesados/` — Datasets limpios listos para ingesta analítica en Power BI.

---

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js:** v18.17+ o v20+ / v22+
- **NPM:** 9+

### Ejecución del Frontend
```bash
# Instalar dependencias
npm install

# Iniciar servidor local
npm run dev
```
Abre tu navegador en: **`http://localhost:3000`**

---

## 📜 Licencia y Derechos
© 2026 Corporación Universitaria Minuto de Dios — **UNIMINUTO**.  
Desarrollado para la **Unidad CADIT** (Vicerrectoría Académica / OEDE).
