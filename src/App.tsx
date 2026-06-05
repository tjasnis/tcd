import React, { useState, useEffect } from 'react';
import {
  Plus,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  XCircle,
  Trash2,
  Edit3,
  Search,
  RotateCcw,
  TrendingUp,
  Award,
  BookMarked,
  Layers,
  GraduationCap,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Materia, Examen } from './types';
import { calcularMateria, obtenerNotaMinima, obtenerTodosExamenes, obtenerExamenesEfectivos } from './utils/calculator';
import MateriaModal from './components/MateriaModal';
import { generateSingleHTML } from './utils/exportTemplate';

export default function App() {
  const [materias, setMaterias] = useState<Materia[]>(() => {
    const saved = localStorage.getItem('materias_universidad_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing localStorage:', e);
        return [];
      }
    }
    return [];
  });

  // Filtros y búsqueda
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'aprobado' | 'en_curso' | 'imposible' | 'sin_notas'>('all');

  // Control del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materiaAEditar, setMateriaAEditar] = useState<Materia | null>(null);

  // Control de eliminación de materia
  const [idAEliminar, setIdAEliminar] = useState<string | null>(null);

  // Guardado automático
  useEffect(() => {
    localStorage.setItem('materias_universidad_data', JSON.stringify(materias));
  }, [materias]);

  const handleSaveMateria = (materia: Materia) => {
    setMaterias((prev) => {
      const existe = prev.some((m) => m.id === materia.id);
      if (existe) {
        return prev.map((m) => (m.id === materia.id ? materia : m));
      } else {
        return [...prev, materia];
      }
    });
  };

  const handleEliminarMateria = (id: string) => {
    setMaterias((prev) => prev.filter((m) => m.id !== id));
    setIdAEliminar(null);
  };

  const handleCargarDemos = () => {
    const demos: Materia[] = [
      {
        id: 'demo-analisis',
        nombre: 'Análisis Matemático I',
        tipo: 'A',
        notaMinimaRef: '4',
        modo: 'ponderado',
        examenes: [
          { id: 'exA1', nombre: 'Parcial 1', peso: 40, nota: 2 },
          { id: 'exA2', nombre: 'TP Integrador', peso: 20, nota: 8 },
          { id: 'exA3', nombre: 'Parcial 2', peso: 40, nota: undefined }, // pendiente
        ],
        secciones: []
      },
      {
        id: 'demo-quimica',
        nombre: 'Química Estructural',
        tipo: 'A',
        notaMinimaRef: '6',
        modo: 'simple',
        examenes: [
          { id: 'exQ1', nombre: 'TP de Laboratorio', nota: 4, esRequisito: true, notaRequisitoMinima: 4 },
          { id: 'exQ2', nombre: 'Evaluación Parcial', nota: 3 },
          { id: 'exQ3', nombre: 'Examen de Cierre', nota: undefined }
        ],
        secciones: []
      },
      {
        id: 'demo-fisica',
        nombre: 'Física I (Por Secciones)',
        tipo: 'B',
        notaMinimaRef: '6',
        modo: 'simple',
        examenes: [],
        secciones: [
          {
            id: 'sec1',
            nombre: 'Primer Bimestre (Mecánica)',
            peso: 50,
            modo: 'simple',
            examenes: [
              { id: 'f1', nombre: 'Teórico Mecánica', nota: 6, esRequisito: true, notaRequisitoMinima: 4 },
              { id: 'f2', nombre: 'Práctico Mecánica', nota: 7 },
            ]
          },
          {
            id: 'sec2',
            nombre: 'Segundo Bimestre (Termo)',
            peso: 50,
            modo: 'simple',
            examenes: [
              { id: 'f3', nombre: 'Proyecto Grupal Especial', nota: 8 },
              { id: 'f4', nombre: 'Parcial Termodinámica', nota: undefined, esRequisito: true, notaRequisitoMinima: 5 }
            ]
          }
        ]
      }
    ];
    setMaterias(demos);
  };

  const handleExportarHTML = () => {
    const htmlContent = generateSingleHTML();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calcular_notas_universitarias.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLimpiarTodo = () => {
    if (window.confirm('¿Seguro pensás borrar todas las materias? No se puede deshacer.')) {
      setMaterias([]);
    }
  };

  // Filtrar materias
  const materiasFiltradas = materias.filter((m) => {
    const resultadosCalculo = calcularMateria(m);
    const cumpleBusqueda = m.nombre.toLowerCase().includes(search.toLowerCase());
    const cumpleFiltro = statusFilter === 'all' || resultadosCalculo.estado === statusFilter;
    return cumpleBusqueda && cumpleFiltro;
  });

  // Métricas generales de la carrera/semestre
  const materiasConNotas = materias.map((m) => {
    const calc = calcularMateria(m);
    return { materia: m, calc };
  });

  const totalMaterias = materias.length;
  const aprobadas = materiasConNotas.filter((mc) => mc.calc.estado === 'aprobado').length;
  const enCurso = materiasConNotas.filter((mc) => mc.calc.estado === 'en_curso').length;
  const imposibles = materiasConNotas.filter((mc) => mc.calc.estado === 'imposible').length;

  // Promedio de promedios actuales
  const promediosFiltrados = materiasConNotas
    .map((mc) => mc.calc.promedioActual)
    .filter((p): p is number => p !== null);
  const promedioGeneral =
    promediosFiltrados.length > 0
      ? promediosFiltrados.reduce((sum, val) => sum + val, 0) / promediosFiltrados.length
      : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased pb-16 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Cabecera / Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Calculadora de Notas
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Aprobación libre y cálculo de objetivos universitarios
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportarHTML}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl cursor-pointer transition-colors"
              title="Descargar este calculador como un sitio web HTML independiente offline"
            >
              <Download className="w-4 h-4 cursor-pointer" />
              <span className="hidden sm:inline">Exportar HTML</span>
            </button>
            <button
              onClick={() => {
                setMateriaAEditar(null);
                setIsModalOpen(true);
              }}
              id="agregar-materia-btn"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-850 rounded-xl cursor-pointer transition-colors shadow-sm shadow-indigo-100"
            >
              <Plus className="w-4 h-4 cursor-pointer" />
              Agregar Materia
            </button>
            {totalMaterias > 0 && (
              <button
                onClick={handleLimpiarTodo}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Vaciar todas las materias"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        
        {/* Secciones de Estadísticas */}
        {totalMaterias > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 text-slate-500 rounded-xl">
                <BookMarked className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Materias</div>
                <div className="text-lg font-extrabold text-slate-800">{totalMaterias}</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Aprobadas / Meta</div>
                <div className="text-lg font-extrabold text-slate-800">{aprobadas}</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">En Curso</div>
                <div className="text-lg font-extrabold text-slate-800">{enCurso}</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Promedio General</div>
                <div className="text-lg font-extrabold text-slate-800">
                  {promedioGeneral > 0 ? promedioGeneral.toFixed(2) : '-'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Barra de Filtros */}
        {totalMaterias > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-250 shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar materia..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto justify-start md:justify-end">
              <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wide">Filtrar:</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas ({totalMaterias})
              </button>
              <button
                onClick={() => setStatusFilter('aprobado')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'aprobado'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-50'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Aprobadas ({aprobadas})
              </button>
              <button
                onClick={() => setStatusFilter('en_curso')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'en_curso'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-50'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                En Curso Ext. ({enCurso})
              </button>
              <button
                onClick={() => setStatusFilter('imposible')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'imposible'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-50'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Críticas ({imposibles})
              </button>
            </div>
          </div>
        )}

        {/* Galería / Grid de Materias */}
        {materias.length === 0 ? (
          /* Estado Vacío */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6 bg-white border border-slate-200 rounded-3xl shadow-sm max-w-lg mx-auto flex flex-col items-center space-y-6"
          >
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <BookOpen className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Empezá a cargar tus materias</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Calculá exactamente cuánto puntaje necesitás en cada entrega restante para aprobar el cuatrimestre, ya sea con promedios simples o ponderados.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full justify-center">
              <button
                onClick={() => {
                  setMateriaAEditar(null);
                  setIsModalOpen(true);
                }}
                className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-850 rounded-xl transition-colors shadow-md shadow-indigo-100 cursor-pointer"
              >
                Cargar tu primera materia
              </button>
              <button
                onClick={handleCargarDemos}
                className="inline-flex items-center justify-center gap-1 px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-250 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                Cargar demostración
              </button>
            </div>
          </motion.div>
        ) : materiasFiltradas.length === 0 ? (
          /* Sin Resultados del Filtro */
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm font-semibold">Ninguna de tus materias coincide con la búsqueda o el filtro.</p>
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
              }}
              className="mt-3 text-sm font-bold text-indigo-600 hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          /* Grid de Tarjetas */
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {materiasFiltradas.map((m) => {
                const calculo = calcularMateria(m);
                const notaAprobacion = obtenerNotaMinima(m);
                const todosExamenes = obtenerTodosExamenes(m);
                const examenesEfectivos = obtenerExamenesEfectivos(m);

                return (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-white rounded-3xl card-shadow flex flex-col justify-between overflow-hidden hover:scale-[1.01] transition-all h-full border-l-4 ${
                      calculo.estado === 'aprobado'
                        ? 'border-emerald-400'
                        : calculo.estado === 'en_curso'
                        ? 'border-amber-400'
                        : calculo.estado === 'imposible' || calculo.estado === 'reprobado_requisito'
                        ? 'border-rose-400'
                        : 'border-slate-300'
                    }`}
                  >
                    {/* Cuerpo de la Tarjeta */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      {/* Cabecera Materia */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          {calculo.estado === 'aprobado' && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 w-fit block leading-none">
                              ✅ Aprobado
                            </span>
                          )}
                          {calculo.estado === 'en_curso' && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 w-fit block leading-none">
                              ⚠️ En curso
                            </span>
                          )}
                          {calculo.estado === 'reprobado_requisito' && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-100 text-red-700 w-fit block leading-none">
                              ❌ Requisito
                            </span>
                          )}
                          {calculo.estado === 'imposible' && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 w-fit block leading-none">
                              ❌ Imposible
                            </span>
                          )}
                          {calculo.estado === 'sin_notas' && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 w-fit block leading-none">
                              ⬜ Sin notas
                            </span>
                          )}
                        </div>

                        {/* Acciones de Edición/Eliminación */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setMateriaAEditar(m);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                            title="Editar materia"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setIdAEliminar(m.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title="Eliminar materia"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Título y subtítulo */}
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight line-clamp-2">
                          {m.nombre}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wide">
                          {m.tipo === 'B' ? 'Por Secciones' : (m.modo === 'simple' ? 'Simple' : 'Ponderado')} • Mínima: {notaAprobacion}
                        </p>
                      </div>

                      {/* Caja de Promedios / Cálculo (Modo Bento) */}
                      <div className="mt-4 flex-1 flex flex-col justify-end">
                        {calculo.estado === 'aprobado' && (
                          <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100 text-center">
                            <p className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-widest">¡Materia Aprobada!</p>
                            <p className="text-4xl font-extrabold text-emerald-800 mt-1">
                              {calculo.promedioActual !== null ? calculo.promedioActual.toFixed(2) : '-'}
                            </p>
                            <p className="text-xs text-emerald-600/90 font-medium mt-1 leading-snug">Ya aseguraste la aprobación</p>
                          </div>
                        )}

                        {calculo.estado === 'en_curso' && (
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60 font-sans">
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider leading-none">Promedio Actual</p>
                                <p className="text-3xl font-extrabold text-slate-800 mt-1.5">
                                  {calculo.promedioActual !== null ? calculo.promedioActual.toFixed(2) : '-'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider leading-none">Necesitás</p>
                                <p className="text-xl font-extrabold text-indigo-600 mt-1.5">
                                  {calculo.notaNecesaria !== null ? calculo.notaNecesaria.toFixed(2) : '-'}
                                </p>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-550 font-medium mt-3 text-center leading-normal border-t border-slate-200/50 pt-2 bg-white/50 -mx-1.5 -mb-1 pb-1 px-2 rounded-lg">
                              Sacar al menos <span className="font-bold text-slate-800">{calculo.notaNecesaria !== null ? calculo.notaNecesaria.toFixed(2) : '-'}</span> en promedio restante.
                            </p>
                          </div>
                        )}

                        {calculo.estado === 'reprobado_requisito' && (
                          <div className="bg-rose-50/90 p-4 rounded-2xl border border-rose-100 text-center">
                            <p className="text-[10px] text-rose-700 font-extrabold uppercase tracking-wider">Hito No Alcanzado</p>
                            <p className="text-xs font-bold text-rose-800 mt-2 leading-relaxed">
                              {calculo.mensaje}
                            </p>
                          </div>
                        )}

                        {calculo.estado === 'imposible' && (
                          <div className="bg-rose-50/90 p-4 rounded-2xl border border-rose-100 text-center">
                            <p className="text-[10px] text-rose-700 font-extrabold uppercase tracking-wider">Materia Crítica</p>
                            <p className="text-3xl font-extrabold text-rose-800 mt-1">
                              {calculo.promedioActual !== null ? calculo.promedioActual.toFixed(2) : '-'}
                            </p>
                            <p className="text-[11px] text-rose-600 font-bold mt-1.5 leading-snug">
                              Es imposible alcanzar la cursada aprobada.
                            </p>
                          </div>
                        )}

                        {calculo.estado === 'sin_notas' && (
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                            <p className="text-xs text-slate-500 font-bold">Faltan notas rindiendo</p>
                            <p className="text-[11px] text-slate-400 font-medium mt-1 leading-normal">
                              Cargá al menos una nota real para activar los cálculos métricos.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Mini checklist de notas preview para Bento */}
                      {examenesEfectivos.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1.5 max-h-[140px] overflow-y-auto">
                          {examenesEfectivos.slice(0, 4).map((ee, idx) => {
                            const ex = ee.examen;
                            const isFilled = ex.nota !== undefined && ex.nota !== null;
                            const hasReq = ex.esRequisito;
                            return (
                              <div key={ex.id || idx} className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                                <span className="truncate pr-2 flex items-center gap-1">
                                  <span>{ex.nombre}</span>
                                  {hasReq && <span className="text-rose-500 font-extrabold" title={`Requisito obligatorio (Nota mín. ${ex.notaRequisitoMinima || 4})`}>*</span>}
                                  {ee.nombreSeccion && <span className="text-[8px] font-bold bg-slate-100 text-slate-400 px-1 rounded truncate max-w-[80px]" title={ee.nombreSeccion}>{ee.nombreSeccion}</span>}
                                </span>
                                <span className={isFilled ? 'text-slate-800 font-black' : 'text-slate-350'}>
                                  {isFilled ? ex.nota : 'Pend.'}
                                </span>
                              </div>
                            );
                          })}
                          {examenesEfectivos.length > 4 && (
                            <p className="text-[8px] font-black text-right text-indigo-500 uppercase tracking-wide">
                              + {examenesEfectivos.length - 4} evaluaciones más
                            </p>
                          )}
                        </div>
                      )}

                      {/* Advertencia si no suma 100% en ponderado de Tipo A */}
                      {m.tipo === 'A' && m.modo === 'ponderado' &&
                        m.examenes.reduce((sum, e) => sum + (e.peso || 0), 0) !== 100 && (
                          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-800 text-[10px] flex items-center gap-1.5 font-bold border border-amber-100">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Pesos: {m.examenes.reduce((sum, e) => sum + (e.peso || 0), 0)}% (debe sumar 100%)</span>
                          </div>
                        )}

                      {/* Advertencia si no suma 100% en Secciones de Tipo B */}
                      {m.tipo === 'B' &&
                        (m.secciones || []).reduce((sum, s) => sum + (s.peso || 0), 0) !== 100 && (
                          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-800 text-[10px] flex items-center gap-1.5 font-bold border border-amber-100">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Suma de secciones: {(m.secciones || []).reduce((sum, s) => sum + (s.peso || 0), 0)}% (debe sumar 100%)</span>
                          </div>
                        )}
                    </div>

                    {/* Footer de Tarjeta con detalles */}
                    <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 shrink-0">
                      <span>{todosExamenes.length} examen{todosExamenes.length !== 1 ? 'es' : ''}</span>
                      <span className="uppercase tracking-widest text-[9px] font-black text-indigo-400/80">Auto-save</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Simple Footer Info */}
      <footer className="max-w-6xl mx-auto px-4 mt-16 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-4 text-slate-450 text-xs font-extrabold tracking-wide mb-12">
        <span>PROMEDIO GENERAL EN CURSO: {promedioGeneral > 0 ? promedioGeneral.toFixed(2) : '-'}</span>
        <span>SISTEMA DE AUTO-GUARDADO LOCAL ACTIVO</span>
        <span>DISCIPLINA ES LIBERTAD • UNIVERSIDAD 2026</span>
      </footer>

      {/* Modal para Crear/Editar Materia */}
      <MateriaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setMateriaAEditar(null);
        }}
        onSave={handleSaveMateria}
        materiaAEditar={materiaAEditar}
      />

      {/* Confirmación al Eliminar Materia */}
      {idAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-100 flex flex-col space-y-4">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl self-start">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-slate-900">¿Eliminar materia?</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Se borrarán todas las notas actuales y la configuración asignada permanentemente de la memoria.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIdAEliminar(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleEliminarMateria(idAEliminar)}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 hover:shadow shadow-sm active:bg-red-800 rounded-lg transition-colors"
              >
                Eliminar Materia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
