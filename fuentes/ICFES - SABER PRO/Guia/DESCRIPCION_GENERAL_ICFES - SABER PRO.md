# Descripción General de la Fuente: ICFES - SABER PRO
**Institución:** Corporación Universitaria Minuto de Dios - UNIMINUTO  
**Área Responsable:** CADIT  
**Fecha de Emisión:** 2026-10-27 16:50:59  

---

## 1. Objetivo y Alcance
Proporcionar información estratégica y homologada proveniente de **ICFES - SABER PRO** para alimentar los tableros analíticos institucionales de permanencia, gestión y planeación académica.

## 2. Ficha Técnica

- **Identificador de Fuente:** `SRC_ICFES - SABER PRO`
- **Entidad Emisora:** ICFES - SABER PRO
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
