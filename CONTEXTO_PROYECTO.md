# 📘 Contexto General del Proyecto — DSA CADIT UNIMINUTO

**Data Sources Automation (DSA)** es la plataforma oficial de monitoreo, catálogo de metadatos, documentación técnica y automatización de fuentes de información de la **Unidad CADIT** (*Conocimiento, Analítica, Datos, Inteligencia Artificial y Transformación Digital*) de la **Vicerrectoría Académica (VAC)** y la **Oficina de Estudios y Diseños Estratégicos (OEDE)** de **UNIMINUTO**.

---

## 🏛️ 1. Identidad de Marca y Principios de Diseño
El diseño de la plataforma implementa de forma estricta el **Manual de Marca CADIT UNIMINUTO**:
- **Símbolo Principal:** El búho en Pixel Art posado sobre la línea amarilla institucional.
- **Tipografía Oficial:** `IBM Plex Sans` (Google Fonts) en toda la interfaz.
- **Paleta de Colores Institucional:**
  - **Azul Principal CADIT:** `#004A93` (cabeceras, acentos y botones primarios).
  - **Amarillo UNIMINUTO:** `#FFD300` (acentos, bordes inferiores de cabecera y llamadas a la acción).
  - **Azul Marino (Navy):** `#212844` (textos, contrastes altos y tarjetas).
  - **Fondo Niebla (Fog):** `#F3F6FB` (fondo general descansado para analítica de datos).

---

## 🗄️ 2. Modelo de Acceso a Fuentes Externas (Modo Solo Lectura)
Para evitar la duplicación de terabytes de información en el disco local o en el repositorio Git, la plataforma opera bajo una política estricta de **lectura directa en red** con detección automática de entorno:
- **Ruta PC Universidad (CADIT):**  
  `C:\Users\daniel.alarcon.f\uniminuto.edu\G- Storage OEDE - VAC - FUENTES_T`
- **Ruta Laptop Personal:**  
  `C:\Users\danie\uniminuto.edu\G- Storage OEDE - VAC - FUENTES_T`
- **Variable de entorno opcional:** `EXTERNAL_FUENTES_PATH` en `.env.local` si se desea forzar una ruta específica.
- **Regla inmutable:** **No se copian, no se mueven y no se eliminan archivos** del almacenamiento institucional. Las APIs inspeccionan en tiempo real las carpetas para extraer metadatos, fechas de última modificación (`mtime`), conteo de archivos y contenido de diccionarios en Markdown.

---

## 📂 3. Estructura de Directorios y Archivos del Proyecto

```
DASHBOARDS/
│
├── app/                                 # Enrutador App Router de Next.js 14 (TypeScript)
│   ├── api/
│   │   ├── doc/
│   │   │   └── route.ts                 # Endpoint GET: Entrega el contenido de LEEME o Diccionarios en Markdown
│   │   ├── sources/
│   │   │   └── route.ts                 # Endpoint GET: Escanea las 36 fuentes en el path externo y retorna su estado
│   │   └── update/
│   │       └── route.ts                 # Endpoint POST: Disparador de sincronización / ejecución de pipeline
│   ├── globals.css                      # Estilos globales y directivas de Tailwind CSS
│   ├── layout.tsx                       # Layout raíz con fuente IBM Plex Sans e íconos institucionales
│   └── page.tsx                         # Dashboard principal: KPIs, filtros, pestañas de categoría y cuadrícula
│
├── components/                          # Componentes modulares de interfaz de usuario
│   ├── DocumentModal.tsx                # Visor modal de documentos Markdown (react-markdown + remark-gfm + resaltado)
│   └── SourceCard.tsx                   # Tarjeta interactiva por fuente con badges de estado y código de color
│
├── manual de marca/                     # Documentación oficial de identidad gráfica
│   ├── Marca CADIT.md                   # Especificaciones de color, tipografía, zona de respeto y facetas del búho
│   └── files/                           # Archivos de respaldo de marca
│
├── public/                              # Archivos estáticos accesibles por el navegador
│   └── brand/
│       ├── CADIT-icono-cabeza.svg       # Ícono del búho en pixel art
│       ├── CADIT-logo-horizontal-color.svg
│       └── CADIT-logo-horizontal-negativo.svg
│
├── types/
│   └── source.ts                        # Definición de tipos TypeScript (DataSource, SourceStatus)
│
├── .env.local                           # Variables de entorno locales (ruta a FUENTES_T)
├── .gitignore                           # Exclusiones de Git (node_modules, .next, archivos de datos crudos)
├── next.config.mjs                      # Configuración de Next.js
├── orquestador.py                       # Orquestador Python de respaldo para pipelines ETL locales
├── package.json                         # Dependencias del proyecto (Next.js, Lucide, React Markdown, Tailwind)
├── postcss.config.js                    # Procesador PostCSS para Tailwind
├── README.md                            # Guía introductoria del repositorio
└── tsconfig.json                        # Configuración de TypeScript
```

---

## 🎨 4. Clasificación de las 36 Fuentes en 6 Categorías Oficiales

La plataforma clasifica la totalidad de las 36 fuentes en **6 grupos temáticos** codificados por color:

### 🔵 1. Educación (14 fuentes) — `border-blue-600`
Sistemas universitarios, financiamiento, calidad educativa, deserción y evaluaciones de estado:
1. **ICETEX** — Créditos educativos, condonaciones y cartera estudiantil.
2. **OLE** (`SNIES/OLE`) — Observatorio Laboral para la Educación y seguimiento a graduados.
3. **SINEB** — Matrícula, deserción y cobertura de educación básica y media.
4. **SNIES** (`SNIES/SNIES`) — Estadísticas de matrícula, programas aprobados y oferta institucional.
5. **SPADIES** (`SNIES/SPADIES`) — Prevención de la deserción universitaria y factores determinantes.
6. **CNA - ACREDITACIÓN** (`SNIES/Acreditacion`) — Acreditación institucional y de programas de alta calidad.
7. **ICFES - SABER PRO** (`ICFES/Saber_Pro`) — Evaluación de competencias genéricas y específicas en educación superior.
8. **ICFES - SABER 11** (`ICFES/Saber_11`) — Examen de Estado de bachilleres para caracterización de aspirantes.
9. **ICFES - SABER TyT** (`ICFES/Saber_TyT`) — Evaluación de competencias en educación técnica y tecnológica.
10. **ICFES - PRE SABER** (`ICFES/Pre_Saber`) — Pruebas de ensayo y diagnóstico vocacional escolar.
11. **ICFES - SABER 3° 5° Y 9°** (`ICFES/Saber_3_5_y_9`) — Evaluación censal en ciclos de educación básica.
12. **SENA** — Oferta técnica, georreferenciación de centros y empleabilidad.
13. **MINCIENCIAS** — Grupos de investigación categorizados e investigadores reconocidos.
14. **EDUCACIÓN SUPERIOR LATAM** — Benchmarking de sistemas universitarios en América Latina.

### 🌸 2. Rosado (11 fuentes) — `border-pink-500`
Competitividad territorial, dinámica demográfica, formalización empresarial e impuestos:
15. **DANE - GEIH / DEMOGRAFÍA** (`DANE/GEIH`) — Gran Encuesta Integrada de Hogares y mercado laboral.
16. **DANE - CENSO POBLACIONAL** (`DANE/CENSO`) — Censo Nacional de Población y Vivienda (CNPV).
17. **DANE - PIB DEPARTAMENTAL** (`DANE/PIB`) — Cuentas nacionales y producto interno bruto por departamento.
18. **DANE - POBREZA Y CONDICIONES DE VIDA** (`DANE/POBREZA`) — Pobreza monetaria y multidimensional (IPM).
19. **DIAN** — Recaudo tributario territorial, formalización fiscal y operaciones aduaneras.
20. **IDC** — Índice Departamental de Competitividad (Consejo Privado de Competitividad).
21. **IDIC** — Índice Departamental de Innovación para Colombia (DNP).
22. **RUES - CONFECÁMARAS** — Registro Único Empresarial y Social y tejido productivo.
23. **ESTADÍSTICAS VITALES** — Dinámica demográfica, nacimientos y defunciones.
24. **GEOPORTAL DANE** — Infraestructura de datos espaciales y cartografía geoestadística.
25. **INEGI MÉXICO** — Estadísticas económicas y educativas para análisis comparativo internacional.

### 🟢 3. Verde (4 fuentes) — `border-emerald-500`
Inversión pública regional, contratación del Estado, conectividad y propiedad intelectual:
26. **SGR - REGALÍAS** (`SGR`) — Proyectos aprobados del Sistema General de Regalías del DNP.
27. **SECOP** — Contratación pública electrónica y convenios institucionales estatales.
28. **MINTIC** — Conectividad a internet fijo, fibra óptica y penetración tecnológica municipal.
29. **PATENTES - SIC** (`PATENTES_SIC`) — Solicitudes y concesiones de patentes de invención y marcas.

### 🔴 4. Rojo (2 fuentes) — `border-rose-500`
Instrumentos estratégicos de planeación y desarrollo municipal/departamental:
30. **TERRIDATA - DNP** — Fichas territoriales comparadas y métricas de calidad de vida municipal.
31. **PLANES DE DESARROLLO** — Planes de desarrollo departamentales y municipales de Colombia.

### 🟠 5. Naranja (3 fuentes) — `border-orange-500`
Mercado laboral, empleo público por mérito y comportamiento de búsqueda digital:
32. **SERVICIO PÚBLICO DE EMPLEO** (`ServicioEmpleo`) — Vacantes activas y demanda ocupacional.
33. **SIMO - CNSC** — Empleo público y convocatorias de mérito de la Comisión Nacional del Servicio Civil.
34. **GOOGLE TRENDS** — Demanda e interés digital de programas académicos y palabras clave.

### 💧 6. Celeste (2 fuentes) — `border-sky-400`
Prestación de servicios de salud y dinamismo del sector turístico:
35. **REPS - SALUD** (`REPS`) — Registro Especial de Prestadores de Servicios de Salud de Minsalud.
36. **REGISTRO NACIONAL DE TURISMO** — Prestadores turísticos, hospedajes y agencias comerciales.

---

## ⚙️ 5. Estructura Homologada de Cada Fuente de Datos (5 Carpetas)
Cada fuente en el almacenamiento institucional OEDE sigue la arquitectura de 5 módulos:
1. `Archivos/` — Descargas crudas inmutables (CSV, XLSX, JSON, APIs).
2. `ETL/` — Scripts de transformación, reglas de negocio y logs de auditoría (`etl_execution.log`).
3. `Diccionarios/` — Catálogo técnico de variables homologadas en formato Markdown (`DICCIONARIO_*.md`).
4. `Guia/` — Instrucciones de consumo, archivos `LEEME.txt` y fichas ejecutivas `DESCRIPCION_GENERAL_*.md`.
5. `Procesados/` — Datos depurados listos para visualizaciones analíticas y tableros en Power BI.

---

## 🚀 6. Guía Rápida de Comandos para Desarrolladores

### Iniciar el entorno de desarrollo
```bash
# Instalar dependencias (solo la primera vez o si se agregaron paquetes)
npm install

# Iniciar servidor local en el puerto 3000
npm run dev
```

### Limpiar caché de compilación en Windows
En caso de advertencias por locks de OneDrive sobre `.next`:
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### Control de Versiones (Git)
```bash
git status
git add app/ components/
git commit -m "feat: descripción del cambio"
git push origin main
```

