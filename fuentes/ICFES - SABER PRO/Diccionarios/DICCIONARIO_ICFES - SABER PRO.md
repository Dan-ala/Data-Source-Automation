# Diccionario de Datos - ICFES - SABER PRO
**Unidad:** CADIT - UNIMINUTO  
**Última Actualización:** 2026-10-27 16:50:59  
**Versión del Esquema:** 1.2  

---

## 1. Descripción del Modelo
Este diccionario describe las variables estandarizadas tras la ejecución del pipeline ETL de **ICFES - SABER PRO**.

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
