import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, AlertTriangle, Layers, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Materia, Seccion, Examen, ModoCalculo, NotaMinimaOpcion, TipoMateria } from '../types';

interface MateriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (materia: Materia) => void;
  materiaAEditar?: Materia | null;
}

export default function MateriaModal({
  isOpen,
  onClose,
  onSave,
  materiaAEditar,
}: MateriaModalProps) {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoMateria>('A');
  const [notaMinimaRef, setNotaMinimaRef] = useState<NotaMinimaOpcion>('4');
  const [notaMinimaCustom, setNotaMinimaCustom] = useState<string>('');
  
  // States specific to Tipo A
  const [modoA, setModoA] = useState<ModoCalculo>('simple');
  const [examenesA, setExamenesA] = useState<Examen[]>([]);

  // States specific to Tipo B (Con Secciones)
  const [seccionesB, setSeccionesB] = useState<Seccion[]>([]);

  const [errorConstruccion, setErrorConstruccion] = useState<string | null>(null);

  // Load edit values
  useEffect(() => {
    if (materiaAEditar) {
      setNombre(materiaAEditar.nombre);
      setTipo(materiaAEditar.tipo || 'A');
      setNotaMinimaRef(materiaAEditar.notaMinimaRef);
      setNotaMinimaCustom(
        materiaAEditar.notaMinimaCustom !== undefined && materiaAEditar.notaMinimaCustom !== null
          ? materiaAEditar.notaMinimaCustom.toString()
          : ''
      );
      
      if (materiaAEditar.tipo === 'B') {
        setSeccionesB(materiaAEditar.secciones || []);
        // default fallback for A
        setModoA('simple');
        setExamenesA([]);
      } else {
        setModoA(materiaAEditar.modo || 'simple');
        setExamenesA(materiaAEditar.examenes || []);
        // default fallback for B
        setSeccionesB([]);
      }
    } else {
      // Default creation state
      setNombre('');
      setTipo('A');
      setNotaMinimaRef('4');
      setNotaMinimaCustom('');
      setModoA('simple');
      setExamenesA([
        { id: '1', nombre: 'Parcial 1', nota: undefined, peso: 50 },
        { id: '2', nombre: 'Parcial 2', nota: undefined, peso: 50 },
      ]);
      setSeccionesB([
        {
          id: 'sec1',
          nombre: 'Primera Instancia (50%)',
          peso: 50,
          modo: 'simple',
          examenes: [
            { id: 'b1', nombre: 'Parcial 1', nota: undefined },
          ],
        },
        {
          id: 'sec2',
          nombre: 'Segunda Instancia (50%)',
          peso: 50,
          modo: 'simple',
          examenes: [
            { id: 'b2', nombre: 'Parcial 2', nota: undefined },
          ],
        },
      ]);
    }
    setErrorConstruccion(null);
  }, [materiaAEditar, isOpen]);

  if (!isOpen) return null;

  // --- HANDLERS TIPO A ---
  const handleExamenAChange = (id: string, campo: keyof Examen, valor: any) => {
    setExamenesA((prev) =>
      prev.map((ex) => {
        if (ex.id !== id) return ex;

        if (campo === 'nota') {
          if (valor === '') return { ...ex, nota: undefined };
          let num = parseFloat(valor);
          if (isNaN(num)) return { ...ex, nota: undefined };
          if (num < 0) num = 0;
          if (num > 10) num = 10;
          return { ...ex, nota: num };
        }

        if (campo === 'peso') {
          if (valor === '') return { ...ex, peso: undefined };
          let num = parseInt(valor, 10);
          if (isNaN(num)) return { ...ex, peso: undefined };
          if (num < 0) num = 0;
          if (num > 100) num = 100;
          return { ...ex, peso: num };
        }

        if (campo === 'esRequisito') {
          return {
            ...ex,
            esRequisito: valor,
            notaRequisitoMinima: valor ? (ex.notaRequisitoMinima ?? 4) : undefined,
          };
        }

        if (campo === 'notaRequisitoMinima') {
          if (valor === '') return { ...ex, notaRequisitoMinima: undefined };
          let num = parseFloat(valor);
          if (isNaN(num)) return { ...ex, notaRequisitoMinima: 4 };
          if (num < 1) num = 1;
          if (num > 10) num = 10;
          return { ...ex, notaRequisitoMinima: num };
        }

        return { ...ex, [campo]: valor };
      })
    );
  };

  const agregarExamenRowA = () => {
    const nuevoId = Math.random().toString(36).substring(2, 9);
    let pesoSugerido = 25;
    if (modoA === 'ponderado' && examenesA.length > 0) {
      const pesoSuma = examenesA.reduce((sum, e) => sum + (e.peso || 0), 0);
      pesoSugerido = Math.max(0, 100 - pesoSuma);
    }
    setExamenesA((prev) => [
      ...prev,
      {
        id: nuevoId,
        nombre: `Examen ${prev.length + 1}`,
        nota: undefined,
        peso: pesoSugerido,
      },
    ]);
  };

  const eliminarExamenRowA = (id: string) => {
    setExamenesA((prev) => prev.filter((e) => e.id !== id));
  };

  // --- HANDLERS TIPO B (Secciones) ---
  const agregarSeccionB = () => {
    const nuevoSecId = Math.random().toString(36).substring(2, 9);
    // Suggest weight to keep total close to 100
    const pesoSuma = seccionesB.reduce((sum, sec) => sum + (sec.peso || 0), 0);
    const pesoSugerido = Math.max(0, 100 - pesoSuma);
    
    setSeccionesB((prev) => [
      ...prev,
      {
        id: nuevoSecId,
        nombre: `Sección ${prev.length + 1}`,
        peso: pesoSugerido,
        modo: 'simple',
        examenes: [
          { id: Math.random().toString(36).substring(2, 9), nombre: 'Parcial 1', nota: undefined },
        ],
      },
    ]);
  };

  const eliminarSeccionB = (secId: string) => {
    setSeccionesB((prev) => prev.filter((s) => s.id !== secId));
  };

  const handleSeccionChange = (secId: string, campo: keyof Seccion, valor: any) => {
    setSeccionesB((prev) =>
      prev.map((sec) => {
        if (sec.id !== secId) return sec;
        
        if (campo === 'peso') {
          if (valor === '') return { ...sec, peso: 0 };
          let num = parseInt(valor, 10);
          if (isNaN(num)) return { ...sec, peso: 0 };
          if (num < 0) num = 0;
          if (num > 100) num = 100;
          return { ...sec, peso: num };
        }
        
        return { ...sec, [campo]: valor };
      })
    );
  };

  const agregarExamenASeccion = (secId: string) => {
    setSeccionesB((prev) =>
      prev.map((sec) => {
        if (sec.id !== secId) return sec;
        
        const nuevoId = Math.random().toString(36).substring(2, 9);
        let pesoSugerido = 50;
        if (sec.modo === 'ponderado' && sec.examenes.length > 0) {
          const pesoSum = sec.examenes.reduce((sum, e) => sum + (e.peso || 0), 0);
          pesoSugerido = Math.max(0, 100 - pesoSum);
        }
        
        return {
          ...sec,
          examenes: [
            ...sec.examenes,
            { id: nuevoId, nombre: `Examen ${sec.examenes.length + 1}`, nota: undefined, peso: pesoSugerido },
          ],
        };
      })
    );
  };

  const eliminarExamenDeSeccion = (secId: string, examId: string) => {
    setSeccionesB((prev) =>
      prev.map((sec) => {
        if (sec.id !== secId) return sec;
        return {
          ...sec,
          examenes: sec.examenes.filter((e) => e.id !== examId),
        };
      })
    );
  };

  const handleExamenSeccionChange = (secId: string, examId: string, campo: keyof Examen, valor: any) => {
    setSeccionesB((prev) =>
      prev.map((sec) => {
        if (sec.id !== secId) return sec;
        
        const nuevosExamenes = sec.examenes.map((ex) => {
          if (ex.id !== examId) return ex;
          
          if (campo === 'nota') {
            if (valor === '') return { ...ex, nota: undefined };
            let num = parseFloat(valor);
            if (isNaN(num)) return { ...ex, nota: undefined };
            if (num < 0) num = 0;
            if (num > 10) num = 10;
            return { ...ex, nota: num };
          }
          
          if (campo === 'peso') {
            if (valor === '') return { ...ex, peso: undefined };
            let num = parseInt(valor, 10);
            if (isNaN(num)) return { ...ex, peso: undefined };
            if (num < 0) num = 0;
            if (num > 100) num = 100;
            return { ...ex, peso: num };
          }

          if (campo === 'esRequisito') {
            return {
              ...ex,
              esRequisito: valor,
              notaRequisitoMinima: valor ? (ex.notaRequisitoMinima ?? 4) : undefined,
            };
          }

          if (campo === 'notaRequisitoMinima') {
            if (valor === '') return { ...ex, notaRequisitoMinima: undefined };
            let num = parseFloat(valor);
            if (isNaN(num)) return { ...ex, notaRequisitoMinima: 4 };
            if (num < 1) num = 1;
            if (num > 10) num = 10;
            return { ...ex, notaRequisitoMinima: num };
          }
          
          return { ...ex, [campo]: valor };
        });
        
        return { ...sec, examenes: nuevosExamenes };
      })
    );
  };

  // Convert A to B or vice-versa seamlessly
  const handleToggleTipo = (nuevoTipo: TipoMateria) => {
    if (nuevoTipo === tipo) return;
    setErrorConstruccion(null);

    if (nuevoTipo === 'B') {
      // Convert A's exams into an initial section
      const pesoMateria = 100;
      const seccionNueva: Seccion = {
        id: 'converted_sec',
        nombre: 'Sección General',
        peso: pesoMateria,
        modo: modoA,
        examenes: [...examenesA],
      };
      setSeccionesB([seccionNueva]);
    } else {
      // Consolidate B's sections into a flat list
      const todosExamenes: Examen[] = [];
      seccionesB.forEach((sec) => {
        todosExamenes.push(...sec.examenes);
      });
      setExamenesA(todosExamenes.length > 0 ? todosExamenes : [
        { id: '1', nombre: 'Parcial 1', nota: undefined },
      ]);
      setModoA('simple');
    }
    setTipo(nuevoTipo);
  };

  // Sum of weights warnings
  const sumPesosA = examenesA.reduce((s, e) => s + (e.peso || 0), 0);
  const advertenciaPesosA = tipo === 'A' && modoA === 'ponderado' && sumPesosA !== 100;

  const sumPesosSeccionesB = seccionesB.reduce((s, sec) => s + (sec.peso || 0), 0);
  const advertenciaSeccionesB = tipo === 'B' && sumPesosSeccionesB !== 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setErrorConstruccion('La materia debe tener un nombre.');
      return;
    }

    let minCustomVal: number | undefined = undefined;
    if (notaMinimaRef === 'custom') {
      const parsed = parseFloat(notaMinimaCustom);
      if (isNaN(parsed) || parsed < 1 || parsed > 10) {
        setErrorConstruccion('La nota mínima personalizada debe ser un número entre 1 y 10.');
        return;
      }
      minCustomVal = parsed;
    }

    if (tipo === 'A') {
      if (examenesA.length === 0) {
        setErrorConstruccion('Cargá al menos un examen en la materia.');
        return;
      }
      const algunExSinNombre = examenesA.some((ex) => !ex.nombre.trim());
      if (algunExSinNombre) {
        setErrorConstruccion('Todos los exámenes deben tener nombre.');
        return;
      }

      const nuevaMateria: Materia = {
        id: materiaAEditar?.id || Math.random().toString(36).substring(2, 9),
        nombre: nombre.trim(),
        tipo: 'A',
        notaMinimaRef,
        notaMinimaCustom: minCustomVal,
        modo: modoA,
        examenes: examenesA.map((ex) => ({
          ...ex,
          nombre: ex.nombre.trim(),
          peso: modoA === 'ponderado' ? (ex.peso || 0) : undefined,
        })),
        secciones: [],
      };

      onSave(nuevaMateria);
    } else {
      // Tipo B
      if (seccionesB.length === 0) {
        setErrorConstruccion('Debés agregar al menos una sección.');
        return;
      }

      for (const sec of seccionesB) {
        if (!sec.nombre.trim()) {
          setErrorConstruccion('Todas las secciones deben tener un nombre.');
          return;
        }
        if (sec.examenes.length === 0) {
          setErrorConstruccion(`La sección "${sec.nombre}" debe tener al menos un examen.`);
          return;
        }
        const algunExSinNombre = sec.examenes.some((ex) => !ex.nombre.trim());
        if (algunExSinNombre) {
          setErrorConstruccion(`Todos los exámenes en la sección "${sec.nombre}" deben tener nombre.`);
          return;
        }

        // Warning or error internally if weighted inside section is selected
        if (sec.modo === 'ponderado') {
          const sumPesosExSec = sec.examenes.reduce((sum, e) => sum + (e.peso || 0), 0);
          if (sumPesosExSec !== 100) {
            // We let them save, but warning in validation checks
          }
        }
      }

      const nuevaMateria: Materia = {
        id: materiaAEditar?.id || Math.random().toString(36).substring(2, 9),
        nombre: nombre.trim(),
        tipo: 'B',
        notaMinimaRef,
        notaMinimaCustom: minCustomVal,
        modo: 'simple', // placeholder, unused
        examenes: [], // placeholder, unused
        secciones: seccionesB.map((sec) => ({
          ...sec,
          nombre: sec.nombre.trim(),
          examenes: sec.examenes.map((ex) => ({
            ...ex,
            nombre: ex.nombre.trim(),
            peso: sec.modo === 'ponderado' ? (ex.peso || 0) : undefined,
          })),
        })),
      };

      onSave(nuevaMateria);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md overflow-hidden">
      <div 
        id="materia-modal-card"
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 leading-tight">
                {materiaAEditar ? 'Configurar Materia' : 'Nueva Materia del Cuatrimestre'}
              </h2>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Plan de notas automático</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorConstruccion && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-2xl flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorConstruccion}</span>
            </div>
          )}

          {/* Name & Structure Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Nombre de la materia</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Álgebra, Física I, Desarrollo Web..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-800 font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Estructura</label>
              <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl gap-0.5">
                <button
                  type="button"
                  onClick={() => handleToggleTipo('A')}
                  className={`py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    tipo === 'A'
                      ? 'bg-indigo-650 text-white shadow'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Simple (A)
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleTipo('B')}
                  className={`py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    tipo === 'B'
                      ? 'bg-indigo-650 text-white shadow shadow-indigo-100'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Secciones (B)
                </button>
              </div>
            </div>
          </div>

          {/* Core Passing Threshold Config */}
          <div className="p-5 bg-indigo-50/50 border border-indigo-100/50 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-extrabold text-indigo-950">Aprobación General</h4>
                <p className="text-[11px] text-indigo-650 font-medium">Nota requerida en la materia para liberarla o aprobar.</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {(['4', '6', '7', 'custom'] as const).map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => {
                      setNotaMinimaRef(op);
                      if (op !== 'custom') setErrorConstruccion(null);
                    }}
                    className={`px-4 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                      notaMinimaRef === op
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {op === 'custom' ? 'PERSONALIZADA' : op}
                  </button>
                ))}
              </div>
            </div>

            {notaMinimaRef === 'custom' && (
              <div className="pt-3 border-t border-indigo-100/50 flex gap-2 items-center">
                <span className="text-xs font-bold text-indigo-850">Nota requerida para aprobar:</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.1"
                  value={notaMinimaCustom}
                  onChange={(e) => {
                    setNotaMinimaCustom(e.target.value);
                    setErrorConstruccion(null);
                  }}
                  placeholder="Ej: 5.5"
                  className="w-24 px-3.5 py-2 bg-white border border-indigo-200 rounded-xl text-slate-800 text-sm font-black text-center focus:border-indigo-500 outline-none"
                />
                <span className="text-[11px] text-slate-450 font-semibold">(número entre 1 y 10)</span>
              </div>
            )}
          </div>

          {/* EXAM MANAGERS */}
          {tipo === 'A' ? (
            // --- TIPO A (Simple Layout) ---
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-sm font-black text-slate-700">Exámenes y Entregas</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Tipo A: Todos los exámenes en una única lista</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Calculation mode */}
                  <div className="flex bg-slate-100 p-1 rounded-xl text-[10px] font-black border border-slate-200/50">
                    <button
                      type="button"
                      onClick={() => setModoA('simple')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        modoA === 'simple' ? 'bg-white text-slate-850 shadow-sm' : 'text-slate-400'
                      }`}
                    >
                      SIMPLE
                    </button>
                    <button
                      type="button"
                      onClick={() => setModoA('ponderado')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        modoA === 'ponderado' ? 'bg-white text-indigo-750 shadow-sm' : 'text-slate-400'
                      }`}
                    >
                      PONDERADO %
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={agregarExamenRowA}
                    className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    AGREGAR EXAMEN
                  </button>
                </div>
              </div>

              {advertenciaPesosA && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
                  <span>
                    El peso total de los exámenes suma <strong>{sumPesosA}%</strong>. Debería sumar <strong>100%</strong> para un cálculo exacto.
                  </span>
                </div>
              )}

              <div className="space-y-3">
                {examenesA.map((ex, index) => (
                  <div
                    key={ex.id}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col space-y-3"
                  >
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-200 w-5 h-5 flex items-center justify-center rounded-md shrink-0">
                        {index + 1}
                      </span>

                      {/* Examen Name */}
                      <div className="flex-1 min-w-[200px]">
                        <input
                          type="text"
                          value={ex.nombre}
                          onChange={(e) => handleExamenAChange(ex.id, 'nombre', e.target.value)}
                          placeholder="Ej: Parcial 1, Recu..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Weight (Only if Weighted) */}
                      {modoA === 'ponderado' && (
                        <div className="w-28 shrink-0 flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Peso:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={ex.peso !== undefined ? ex.peso : ''}
                            onChange={(e) => handleExamenAChange(ex.id, 'peso', e.target.value)}
                            placeholder="%"
                            className="w-full font-bold text-sm text-slate-700 outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="text-xs font-bold text-slate-400">%</span>
                        </div>
                      )}

                      {/* Grade Input */}
                      <div className="w-32 shrink-0 flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Nota:</span>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={ex.nota !== undefined ? ex.nota : ''}
                          onChange={(e) => handleExamenAChange(ex.id, 'nota', e.target.value)}
                          placeholder="Pendiente"
                          className="w-full font-bold text-sm text-slate-700 outline-none text-center placeholder:text-slate-350"
                        />
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => eliminarExamenRowA(ex.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                        title="Eliminar examen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Requirements Checkbox */}
                    <div className="flex items-center gap-4 bg-white/60 p-2 rounded-xl border border-slate-150/40 text-xs">
                      <label className="flex items-center gap-2 font-bold text-slate-650 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!ex.esRequisito}
                          onChange={(e) => handleExamenAChange(ex.id, 'esRequisito', e.target.checked)}
                          className="accent-indigo-650 w-4 h-4 cursor-pointer"
                        />
                        ¿Es requisito obligatorio para aprobar la materia?
                      </label>
                      {ex.esRequisito && (
                        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                          <span className="text-[10px] font-extrabold uppercase text-slate-500">Nota mínima requerida:</span>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            step="0.5"
                            value={ex.notaRequisitoMinima ?? 4}
                            onChange={(e) => handleExamenAChange(ex.id, 'notaRequisitoMinima', e.target.value)}
                            className="w-16 text-center font-extrabold text-indigo-700 bg-indigo-50/50 rounded-lg px-1 py-0.5 border border-indigo-100"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // --- TIPO B (Con Secciones) ---
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-sm font-black text-slate-750">Secciones de la Materia</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Tipo B: Exámenes organizados por módulos independientes</p>
                </div>
                <button
                  type="button"
                  onClick={agregarSeccionB}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-xs font-black text-indigo-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  AGREGAR NUEVA SECCIÓN
                </button>
              </div>

              {advertenciaSeccionesB && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
                  <span>
                    El peso total de las secciones suma <strong>{sumPesosSeccionesB}%</strong>. Debería sumar exactamente <strong>100%</strong> para que la nota final sea precisa.
                  </span>
                </div>
              )}

              <div className="space-y-6">
                {seccionesB.map((sec, secIdx) => {
                  const sumSecExWeight = sec.examenes.reduce((sum, e) => sum + (e.peso || 0), 0);
                  const advSecExWeight = sec.modo === 'ponderado' && sumSecExWeight !== 100;

                  return (
                    <div
                      key={sec.id}
                      className="p-5 bg-white border-2 border-slate-200/70 rounded-3xl space-y-4"
                    >
                      {/* Section Info Header */}
                      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-indigo-700 bg-indigo-50 p-2 leading-none rounded-xl">
                            Sec. {secIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={sec.nombre}
                            onChange={(e) => handleSeccionChange(sec.id, 'nombre', e.target.value)}
                            placeholder="Nombre de la Sección (ej: Primera Nota)"
                            className="bg-transparent border-b border-slate-300 font-extrabold text-sm text-slate-800 focus:border-indigo-500 outline-none pb-0.5 w-64"
                          />
                        </div>

                        {/* Section percentage weight and control */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-black text-slate-400 uppercase">PESO EN FINAL:</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sec.peso}
                              onChange={(e) => handleSeccionChange(sec.id, 'peso', e.target.value)}
                              className="w-12 text-right font-extrabold text-xs text-indigo-700 bg-transparent outline-none"
                            />
                            <span className="text-[10px] font-bold text-slate-400">%</span>
                          </div>

                          <div className="flex bg-slate-100 p-0.5 rounded-xl text-[9px] font-semibold border border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleSeccionChange(sec.id, 'modo', 'simple')}
                              className={`px-2 py-1 rounded-lg ${
                                sec.modo === 'simple' ? 'bg-white text-slate-850 font-black shadow-sm' : 'text-slate-450'
                              }`}
                            >
                              SIMPLE
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSeccionChange(sec.id, 'modo', 'ponderado')}
                              className={`px-2 py-1 rounded-lg ${
                                sec.modo === 'ponderado' ? 'bg-white text-indigo-750 font-black shadow-sm' : 'text-slate-450'
                              }`}
                            >
                              POND.
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => eliminarSeccionB(sec.id)}
                            className="p-1 px-2 hover:bg-rose-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors text-xs font-bold"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>

                      {/* Section Exams Warning */}
                      {advSecExWeight && (
                        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-250 text-amber-800 text-[10px] flex items-center gap-1.5 font-bold">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Los pesos de exámenes en esta sección suman {sumSecExWeight}% (debe ser 100%)</span>
                        </div>
                      )}

                      {/* Nested Exam Rows */}
                      <div className="space-y-3">
                        {sec.examenes.map((ex, exIdx) => (
                          <div
                            key={ex.id}
                            className="bg-slate-50/60 border border-slate-150 rounded-2xl p-3.5 space-y-2.5"
                          >
                            <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                              <span className="text-[9px] font-bold text-slate-450 bg-slate-200 w-4 h-4 rounded flex items-center justify-center shrink-0">
                                {exIdx + 1}
                              </span>

                              {/* Exam Name */}
                              <div className="flex-1 min-w-[150px]">
                                <input
                                  type="text"
                                  value={ex.nombre}
                                  onChange={(e) => handleExamenSeccionChange(sec.id, ex.id, 'nombre', e.target.value)}
                                  placeholder="Ej: Parcial de Sección..."
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-705 outline-none focus:border-indigo-400"
                                />
                              </div>

                              {/* Nested Weight inside Section */}
                              {sec.modo === 'ponderado' && (
                                <div className="w-24 shrink-0 flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5">
                                  <span className="text-[9px] font-black text-slate-400">% SEC:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={ex.peso !== undefined ? ex.peso : ''}
                                    onChange={(e) => handleExamenSeccionChange(sec.id, ex.id, 'peso', e.target.value)}
                                    placeholder="%"
                                    className="w-full font-bold text-xs text-slate-700 outline-none text-right"
                                  />
                                </div>
                              )}

                              {/* Nested Grade */}
                              <div className="w-28 shrink-0 flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5">
                                <span className="text-[9px] font-black text-slate-400">NOTA:</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="0.1"
                                  value={ex.nota !== undefined ? ex.nota : ''}
                                  onChange={(e) => handleExamenSeccionChange(sec.id, ex.id, 'nota', e.target.value)}
                                  placeholder="Pendiente"
                                  className="w-full font-bold text-xs text-slate-705 text-center outline-none"
                                />
                              </div>

                              {/* Delete nested */}
                              <button
                                type="button"
                                onClick={() => eliminarExamenDeSeccion(sec.id, ex.id)}
                                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Requirements in nested */}
                            <div className="flex items-center gap-4 bg-white/60 p-1.5 rounded-lg border border-slate-200/40 text-[11px]">
                              <label className="flex items-center gap-1.5 font-bold text-slate-500 select-none cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!ex.esRequisito}
                                  onChange={(e) => handleExamenSeccionChange(sec.id, ex.id, 'esRequisito', e.target.checked)}
                                  className="accent-indigo-650 w-3.5 h-3.5 cursor-pointer"
                                />
                                ¿Requisito de sección obligatorio?
                              </label>
                              {ex.esRequisito && (
                                <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                                  <span className="text-[9px] font-black text-slate-400 uppercase">Nota Mínima req:</span>
                                  <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    step="0.5"
                                    value={ex.notaRequisitoMinima ?? 4}
                                    onChange={(e) => handleExamenSeccionChange(sec.id, ex.id, 'notaRequisitoMinima', e.target.value)}
                                    className="w-12 text-center font-extrabold text-indigo-700 bg-indigo-50/50 rounded px-1 text-xs border border-indigo-100"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add nested exam btn */}
                      <button
                        type="button"
                        onClick={() => agregarExamenASeccion(sec.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-black text-indigo-650 hover:text-indigo-850"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        AGREGAR EXAMEN A ESTA SECCIÓN
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </form>

        {/* Action controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs uppercase tracking-wider font-extrabold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="px-6 py-2.5 text-xs uppercase tracking-wider font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl cursor-pointer transition-colors shadow-lg shadow-indigo-100"
          >
            {materiaAEditar ? 'Guardar Cambios' : 'Crear Materia'}
          </button>
        </div>
      </div>
    </div>
  );
}
