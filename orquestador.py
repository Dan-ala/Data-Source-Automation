#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
UNIMINUTO - Vicerrectoría / CADIT (Centro de Apoyo y Desarrollo Institucional)
Proyecto: Data Sources Automation (DSA)
Script: orquestador.py
Descripción: Orquestador base para automatización del flujo de fuentes de datos.
=============================================================================
Flujo ejecutado:
  1. Descarga de archivo fuente (Simulación en carpeta 'Archivos/')
  2. Ejecución de ETL y validación (Simulación en 'Procesados/' y log en 'ETL/')
  3. Generación / Actualización de Diccionario de Datos ('Diccionarios/')
  4. Actualización del archivo de control 'LEEME.txt' ('Guia/')
  5. Generación de la Descripción General de la Fuente ('Guia/')
=============================================================================
"""

import os
import sys
from datetime import datetime

# Garantizar compatibilidad UTF-8 en consolas Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def print_banner(source_name: str):
    print("=" * 70)
    print("  CADIT UNIMINUTO | Data Sources Automation (DSA)")
    print(f"  Orquestando Fuente: [{source_name.upper()}]")
    print(f"  Fecha y Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)

def ensure_directory(path: str):
    """Crea un directorio si no existe previamente."""
    if not os.path.exists(path):
        os.makedirs(path, exist_ok=True)
        print(f"  [+] Directorio creado: {path}")

def step_1_download(base_path: str, source_name: str, timestamp_str: str) -> str:
    """Paso 1: Descarga o recepción del archivo bruto."""
    print("\n[Paso 1/5] Descargando archivo fuente...")
    folder = os.path.join(base_path, "Archivos")
    ensure_directory(folder)
    
    filename = f"{source_name.lower()}_raw_{timestamp_str}.csv"
    file_path = os.path.join(folder, filename)
    
    csv_content = (
        "id,codigo_estudiante,periodo,programa_academico,valor_credito,estado\n"
        f"1,000123456,2026-1,Ingeniería de Sistemas,2500000,ACTIVO\n"
        f"2,000654321,2026-1,Administración de Empresas,2100000,ACTIVO\n"
        f"3,000987654,2026-1,Licenciatura en Educación,1850000,EN_PROCESO\n"
    )
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(csv_content)
        
    print(f"  [OK] Archivo crudo generado exitosamente: {file_path}")
    return file_path

def step_2_etl(base_path: str, source_name: str, raw_file_path: str, timestamp_str: str) -> str:
    """Paso 2: Transformación, limpieza y validación de reglas de negocio."""
    print("\n[Paso 2/5] Ejecutando pipeline ETL...")
    etl_folder = os.path.join(base_path, "ETL")
    proc_folder = os.path.join(base_path, "Procesados")
    ensure_directory(etl_folder)
    ensure_directory(proc_folder)
    
    # 2.1 Guardar log de ETL
    log_path = os.path.join(etl_folder, "etl_execution.log")
    with open(log_path, "a", encoding="utf-8") as log_file:
        log_file.write(
            f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] ETL ejecutado para {source_name}. "
            f"Origen: {os.path.basename(raw_file_path)} - Estado: EXITOSO (3 registros depurados)\n"
        )
    
    # 2.2 Guardar archivo limpio procesado
    proc_filename = f"{source_name.lower()}_procesado_{timestamp_str}.csv"
    proc_file_path = os.path.join(proc_folder, proc_filename)
    
    proc_content = (
        "id_registro,codigo_uniminuto,periodo_academico,programa,monto_formateado,estado_homologado,fecha_proceso\n"
        f"1,000123456,2026-1,INGENIERIA DE SISTEMAS,2500000.00,ACTIVO,{timestamp_str}\n"
        f"2,000654321,2026-1,ADMINISTRACION DE EMPRESAS,2100000.00,ACTIVO,{timestamp_str}\n"
        f"3,000987654,2026-1,LICENCIATURA EN EDUCACION,1850000.00,REVISION,{timestamp_str}\n"
    )
    
    with open(proc_file_path, "w", encoding="utf-8") as f:
        f.write(proc_content)
        
    print(f"  [OK] Dataset limpio y transformado en: {proc_file_path}")
    print(f"  [OK] Registro de auditoría guardado en: {log_path}")
    return proc_file_path

def step_3_update_dictionary(base_path: str, source_name: str, timestamp_str: str):
    """Paso 3: Generación o actualización del Diccionario de Datos (.md)."""
    print("\n[Paso 3/5] Actualizando Diccionario de Datos (.md)...")
    folder = os.path.join(base_path, "Diccionarios")
    ensure_directory(folder)
    
    dict_file_path = os.path.join(folder, f"DICCIONARIO_{source_name.upper()}.md")
    
    dict_content = f"""# Diccionario de Datos - {source_name.upper()}
**Unidad:** CADIT - UNIMINUTO  
**Última Actualización:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  
**Versión del Esquema:** 1.2  

---

## 1. Descripción del Modelo
Este diccionario describe las variables estandarizadas tras la ejecución del pipeline ETL de **{source_name.upper()}**.

## 2. Variables y Campos Homologados

| Variable | Tipo de Dato | Longitud | Permite Nulos | Descripción Técnica | Regla de Negocio / Transformación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_registro` | Integer | Auto | No | Clave primaria incremental del registro | Generado por el script de ingestión |
| `codigo_uniminuto` | Varchar | 12 | No | Código de identificación institucional del estudiante | Validación de longitud y caracteres numéricos |
| `periodo_academico` | Varchar | 7 | No | Periodo de vigencia del reporte (ej. 2026-1) | Formato estandarizado YYYY-P |
| `programa` | Varchar | 120 | No | Denominación del programa curricular en mayúsculas | Conversión estándar a mayúsculas sin tildes |
| `monto_formateado` | Decimal(12,2) | 12 | Sí | Valor monetario asociado al beneficio o reporte | Estandarizado a 2 decimales sin símbolos de moneda |
| `estado_homologado` | Varchar | 20 | No | Estado operativo del registro (ACTIVO, INACTIVO, REVISION) | Mapeo unificado según catálogo CADIT |
| `fecha_proceso` | Timestamp | - | No | Marca temporal exacta de procesamiento | Asignado automáticamente por el orquestador |

## 3. Notas de Calidad de Datos
- Las inconsistencias se envían a la bitácora `ETL/etl_execution.log`.
- Se requiere conciliación mensual con las cifras de Registro y Control.
"""

    with open(dict_file_path, "w", encoding="utf-8") as f:
        f.write(dict_content)
        
    print(f"  [OK] Diccionario de datos actualizado: {dict_file_path}")

def step_4_update_readme(base_path: str, source_name: str):
    """Paso 4: Actualización del archivo de guía rápida LEEME.txt."""
    print("\n[Paso 4/5] Actualizando archivo de control LEEME.txt...")
    folder = os.path.join(base_path, "Guia")
    ensure_directory(folder)
    
    readme_path = os.path.join(folder, "LEEME.txt")
    
    readme_content = f"""================================================================================
GUIA OPERATIVA DE LA FUENTE: {source_name.upper()}
CADIT - UNIMINUTO (Data Sources Automation - DSA)
================================================================================
Fecha de Sincronización: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Estado del Proceso: OK (Automatizado)

ESTRUCTURA DE ARCHIVOS:
--------------------------------------------------------------------------------
1. Archivos/      -> Almacena las descargas originales e inmutables (CSV/XLSX/PDF).
2. Diccionarios/  -> Contiene 'DICCIONARIO_{source_name.upper()}.md' con el catálogo técnico.
3. ETL/           -> Scripts Python y logs de auditoría 'etl_execution.log'.
4. Guia/          -> Contiene este LEEME.txt y la ficha técnica descriptiva.
5. Procesados/    -> Datasets limpios listos para tableros de BI institucional.

INSTRUCCIONES DE ACTUALIZACION MANUAL:
--------------------------------------------------------------------------------
Para volver a procesar esta fuente manualmente desde consola:
$ python orquestador.py {source_name.upper()}

En caso de incidencias técnicas contactar al equipo de Ingeniería de Datos CADIT.
================================================================================
"""
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(readme_content)
        
    print(f"  [OK] LEEME.txt actualizado: {readme_path}")

def step_5_update_general_description(base_path: str, source_name: str):
    """Paso 5: Generación / Actualización de la Descripción General en Markdown."""
    print(f"\n[Paso 5/5] Actualizando DESCRIPCION_GENERAL_{source_name.upper()}.md...")
    folder = os.path.join(base_path, "Guia")
    ensure_directory(folder)
    
    desc_path = os.path.join(folder, f"DESCRIPCION_GENERAL_{source_name.upper()}.md")
    
    desc_content = f"""# Descripción General de la Fuente: {source_name.upper()}
**Institución:** Corporación Universitaria Minuto de Dios - UNIMINUTO  
**Área Responsable:** CADIT  
**Fecha de Emisión:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  

---

## 1. Objetivo y Alcance
Proporcionar información estratégica y homologada proveniente de **{source_name.upper()}** para alimentar los tableros analíticos institucionales de permanencia, gestión y planeación académica.

## 2. Ficha Técnica

- **Identificador de Fuente:** `SRC_{source_name.upper()}`
- **Entidad Emisora:** {source_name.upper()}
- **Periodicidad de Actualización:** Mensual / Semestral
- **Formato de Entrada:** Archivos planos tabulados (CSV/Delimitado por comas)
- **Destino Final:** Bodega de Datos CADIT / Power BI Service

## 3. Flujo Automatizado (DSA)
```
[Descarga / Ingesta] --> [Validación ETL] --> [Consolidación Procesados]
          │
          └──> [Actualización Diccionario & Fichas Técnicas]
```

## 4. Responsabilidades
- **Operador Técnico:** Ingeniero de Datos CADIT.
- **Líder Funcional:** Coordinador de Analítica Institucional UNIMINUTO.
"""
    with open(desc_path, "w", encoding="utf-8") as f:
        f.write(desc_content)
        
    print(f"  [OK] Descripción General actualizada: {desc_path}")

def execute_pipeline(source_name: str):
    """Orquesta los 5 pasos consecutivos para la fuente especificada."""
    source_name = source_name.strip()
    if not source_name:
        raise ValueError("El nombre de la fuente no puede estar vacío.")
    
    print_banner(source_name)
    
    # Directorio base para la fuente actual: ./fuentes/{FUENTE}/
    base_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fuentes", source_name.upper())
    ensure_directory(base_dir)
    
    timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Ejecución secuencial de los 5 pasos
    raw_file = step_1_download(base_dir, source_name, timestamp_str)
    step_2_etl(base_dir, source_name, raw_file, timestamp_str)
    step_3_update_dictionary(base_dir, source_name, timestamp_str)
    step_4_update_readme(base_dir, source_name)
    step_5_update_general_description(base_dir, source_name)
    
    print("\n" + "=" * 70)
    print(f"  [EXITO] Pipeline completado para: {source_name.upper()}")
    print(f"  Todos los archivos y guías fueron generados en: {base_dir}")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    # Lee el argumento de línea de comandos o usa ICETEX por defecto
    target_source = sys.argv[1] if len(sys.argv) > 1 else "ICETEX"
    try:
        execute_pipeline(target_source)
        sys.exit(0)
    except Exception as e:
        print(f"\n[ERROR CRITICO] Falló la orquestación: {str(e)}", file=sys.stderr)
        sys.exit(1)
