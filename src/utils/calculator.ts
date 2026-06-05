import { Materia, Examen } from '../types';

export interface CalculoResultado {
  promedioActual: number | null;
  notaNecesaria: number | null;
  estado: 'aprobado' | 'en_curso' | 'imposible' | 'sin_notas' | 'reprobado_requisito';
  mensaje: string;
}

export interface ExamenEfectivo {
  examen: Examen;
  pesoEfectivo: number; // % sobre el valor total de la nota final (0-100)
  nombreSeccion?: string;
}

export function obtenerNotaMinima(materia: Materia): number {
  if (materia.notaMinimaRef === 'custom') {
    return materia.notaMinimaCustom !== undefined && materia.notaMinimaCustom !== null
      ? materia.notaMinimaCustom
      : 4;
  }
  return parseInt(materia.notaMinimaRef, 10);
}

export function obtenerTodosExamenes(materia: Materia): Examen[] {
  if (materia.tipo === 'B') {
    const list: Examen[] = [];
    (materia.secciones || []).forEach((sec) => {
      list.push(...(sec.examenes || []));
    });
    return list;
  }
  return materia.examenes || [];
}

export function obtenerExamenesEfectivos(materia: Materia): ExamenEfectivo[] {
  if (materia.tipo === 'A') {
    const totalExamenes = (materia.examenes || []).length;
    if (totalExamenes === 0) return [];
    
    if (materia.modo === 'simple') {
      const pesoEquitativo = 100 / totalExamenes;
      return materia.examenes.map((ex) => ({
        examen: ex,
        pesoEfectivo: pesoEquitativo,
      }));
    } else {
      return materia.examenes.map((ex) => ({
        examen: ex,
        pesoEfectivo: ex.peso || 0,
      }));
    }
  } else {
    // Tipo B con secciones
    const list: ExamenEfectivo[] = [];
    const secciones = materia.secciones || [];
    
    secciones.forEach((sec) => {
      const totalExamenesSec = (sec.examenes || []).length;
      if (totalExamenesSec === 0) return;
      
      const pesoSeccion = sec.peso ?? 0;
      
      sec.examenes.forEach((ex) => {
        let pesoInterno = 0;
        if (sec.modo === 'simple') {
          pesoInterno = 100 / totalExamenesSec;
        } else {
          pesoInterno = ex.peso || 0;
        }
        
        const pesoEfectivo = (pesoInterno * pesoSeccion) / 100;
        list.push({
          examen: ex,
          pesoEfectivo,
          nombreSeccion: sec.nombre,
        });
      });
    });
    return list;
  }
}

export function calcularMateria(materia: Materia): CalculoResultado {
  const notaMinima = obtenerNotaMinima(materia);
  const todosExamenes = obtenerTodosExamenes(materia);
  
  const formatoNota = (val: number) => {
    const rounded = Math.round(val * 100) / 100;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2);
  };

  // 1. Validar si hay exámenes creados
  if (todosExamenes.length === 0) {
    return {
      promedioActual: null,
      notaNecesaria: null,
      estado: 'sin_notas',
      mensaje: 'Cargá al menos una entrega para ver tu estado',
    };
  }

  // 2. Comprobar requisitos obligatorios
  const requisitoFallado = todosExamenes.find((ex) => {
    if (ex.esRequisito && ex.nota !== undefined && ex.nota !== null && !isNaN(ex.nota)) {
      const minReq = ex.notaRequisitoMinima ?? 4;
      return ex.nota < minReq;
    }
    return false;
  });

  // Calculamos los exámenes efectivos de la materia
  const examenesEfectivos = obtenerExamenesEfectivos(materia);
  
  // Separamos en rendidos y pendientes
  const rendidos = examenesEfectivos.filter(
    (ee) => ee.examen.nota !== undefined && ee.examen.nota !== null && !isNaN(ee.examen.nota)
  );
  
  const pendientes = examenesEfectivos.filter(
    (ee) => ee.examen.nota === undefined || ee.examen.nota === null || isNaN(ee.examen.nota)
  );

  const totalExamenes = examenesEfectivos.length;
  const cantRendidos = rendidos.length;
  const cantPendientes = pendientes.length;

  // Si no hay exámenes con nota rendida aún
  if (cantRendidos === 0) {
    // Si ya falló algún requisito, pero no debería darse si no tienen nota.
    return {
      promedioActual: null,
      notaNecesaria: null,
      estado: 'sin_notas',
      mensaje: 'Cargá al menos una nota para ver tu estado',
    };
  }

  // Calcular promedio parcial y actual
  const sumaPesosRendidos = rendidos.reduce((acc, curr) => acc + curr.pesoEfectivo, 0);
  const promedioParcial = rendidos.reduce((acc, curr) => acc + (curr.examen.nota || 0) * curr.pesoEfectivo, 0);
  
  const promedioActual = sumaPesosRendidos > 0 ? promedioParcial / sumaPesosRendidos : 0;

  // Si falló por requisito obligatorio, se muestra de forma prioritaria
  if (requisitoFallado) {
    const minReq = requisitoFallado.notaRequisitoMinima ?? 4;
    return {
      promedioActual,
      notaNecesaria: null,
      estado: 'reprobado_requisito',
      mensaje: `Reprobaste "${requisitoFallado.nombre}" (Sacaste ${requisitoFallado.nota}, necesitabas al menos ${minReq}), requisito obligatorio para aprobar.`,
    };
  }

  // Caso: Todo está rendido
  if (cantPendientes === 0) {
    // Nota final ponderada o general
    const notaFinal = promedioParcial / 100; // si suman 100%
    // Para simplificar, usamos promedioActual cuando no hay pendientes
    const aprobado = promedioActual >= notaMinima;
    return {
      promedioActual,
      notaNecesaria: null,
      estado: aprobado ? 'aprobado' : 'imposible',
      mensaje: aprobado
        ? `Promedio actual: ${formatoNota(promedioActual)}. ¡Ya aprobaste!`
        : `Promedio final: ${formatoNota(promedioActual)}. Es insuficiente para aprobar (${notaMinima})`,
    };
  }

  // Caso: Hay exámenes pendientes
  const sumaPesosPendientes = pendientes.reduce((acc, curr) => acc + curr.pesoEfectivo, 0);

  if (sumaPesosPendientes <= 0) {
    // Si la suma de pesos de los pendientes es cero, no podemos estimar la nota necesaria
    return {
      promedioActual,
      notaNecesaria: null,
      estado: 'en_curso',
      mensaje: 'Configure el peso de los exámenes pendientes para poder calcular.',
    };
  }

  // notaNecesaria = (notaMinima * 100 - promedioParcial) / pesoPendiente
  const notaNecesaria = (notaMinima * 100 - promedioParcial) / sumaPesosPendientes;

  if (notaNecesaria <= 0) {
    return {
      promedioActual,
      notaNecesaria: 0,
      estado: 'aprobado',
      mensaje: `Promedio actual: ${formatoNota(promedioActual)}. ¡Ya aprobaste sin rendir lo que falta!`,
    };
  } else if (notaNecesaria > 10) {
    return {
      promedioActual,
      notaNecesaria: null,
      estado: 'imposible',
      mensaje: `Con las notas actuales es imposible aprobar (necesitás sacar ${formatoNota(notaNecesaria)} de promedio en lo pendiente)`,
    };
  } else {
    return {
      promedioActual,
      notaNecesaria,
      estado: 'en_curso',
      mensaje: `Promedio actual: ${formatoNota(promedioActual)}. Necesitás sacar al menos ${formatoNota(
        notaNecesaria
      )} de promedio en los exámenes pendientes para aprobar`,
    };
  }
}
