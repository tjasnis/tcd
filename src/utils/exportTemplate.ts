export function generateSingleHTML(): string {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calculadora de Notas • Especial Estudiantes Universitarios</title>
  <!-- Google Fonts & Tailwind CDN -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      font-family: 'Inter', sans-serif;
    }
    .card-shadow {
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05), 0 0 0 1px rgb(226 232 240 / 0.8);
    }
    /* Custom scrollbars */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased selection:bg-indigo-100 min-h-screen flex flex-col justify-between">

  <div>
    <!-- Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l9-5-9-5-9 5 9 5zm0 0v6m0-6L3 9m12 5l7-3.5L12 7"></path></svg>
          </div>
          <div>
            <h1 class="text-xl font-black text-slate-900 tracking-tight leading-none">Calculadora de Notas</h1>
            <p class="text-xs font-semibold text-slate-400 mt-1">Estructuras universitarias personalizadas con Secciones e Hitos</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-nueva-materia" class="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-sm shadow-indigo-100 flex items-center gap-1.5 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
            Nueva Materia
          </button>
          <button id="btn-vaciar" class="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer" title="Cargar demo completo">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Workspace -->
    <main class="max-w-6xl mx-auto px-4 mt-8 space-y-8 pb-16">
      
      <!-- Stats Dashboard -->
      <section id="dashboard-stats" class="grid grid-cols-2 lg:grid-cols-4 gap-4 hidden">
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div class="p-2.5 bg-slate-50 text-slate-500 rounded-xl">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <div>
            <div class="text-[9px] font-black uppercase tracking-wider text-slate-400">Materias Totales</div>
            <div id="stat-total" class="text-base font-black text-slate-800">-</div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div class="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <div class="text-[9px] font-black uppercase tracking-wider text-slate-400">Ya Aprobadas</div>
            <div id="stat-aprobado" class="text-base font-black text-slate-800">-</div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div class="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <div class="text-[9px] font-black uppercase tracking-wider text-slate-400">Cursando / En curso</div>
            <div id="stat-encurso" class="text-base font-black text-slate-800">-</div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div class="p-2.5 bg-indigo-50 text-indigo-650 rounded-xl">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <div>
            <div class="text-[9px] font-black uppercase tracking-wider text-slate-400">Promedio General</div>
            <div id="stat-promedio" class="text-base font-black text-indigo-700">-</div>
          </div>
        </div>
      </section>

      <!-- Search and Filter Bar -->
      <section id="search-filter-bar" class="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hidden">
        <div class="relative w-full md:w-80">
          <input type="text" id="search-input" placeholder="Buscar materia..." class="w-full pl-4 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-705">
        </div>
        <div class="flex flex-wrap items-center gap-1">
          <button onclick="setStatusFilter('all')" class="filter-btn px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-indigo-700 text-white shadow-sm" id="btn-filter-all">Todas</button>
          <button onclick="setStatusFilter('aprobado')" class="filter-btn px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" id="btn-filter-aprobado">Aprobadas</button>
          <button onclick="setStatusFilter('en_curso')" class="filter-btn px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" id="btn-filter-en_curso">En curso</button>
          <button onclick="setStatusFilter('imposible')" class="filter-btn px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" id="btn-filter-imposible">Críticas</button>
        </div>
      </section>

      <!-- Subject Grid -->
      <section id="materias-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Dynamic Cards -->
      </section>

      <!-- Empty State -->
      <section id="empty-state" class="text-center py-20 px-6 bg-white border border-slate-200 rounded-3xl max-w-lg mx-auto flex flex-col items-center space-y-6">
        <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        </div>
        <div class="space-y-2">
          <h3 class="text-xl font-bold text-slate-900">Configurá tus materias de la facultad</h3>
          <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">Calculá de manera instantánea cuántas notas necesitás en los parciales que faltan para promocionar o regularizar la materia.</p>
        </div>
        <div class="flex flex-col sm:flex-row justify-center gap-2 w-full max-w-xs">
          <button id="btn-crear-primer" class="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer">Nueva Materia</button>
          <button onclick="cargarDemos()" class="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">Cargar Demo</button>
        </div>
      </section>

    </main>
  </div>

  <!-- Persistent Local Footer -->
  <footer class="max-w-6xl w-full mx-auto px-4 mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-4 text-slate-400 text-[10px] font-black tracking-wide mb-8">
    <span>SISTEMA DE AUTO-GUARDADO ACTIVO EN ESTE ARCHIVO</span>
    <span>DISCIPLINA ES LIBERTAD • UNIVERSIDAD</span>
  </footer>

  <!-- MODAL FOR CREATION/EDITION -->
  <div id="modal-materia" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm hidden">
    <div class="w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <div>
            <h3 id="modal-title" class="text-base font-extrabold text-slate-900 leading-none">Nueva Materia</h3>
            <p class="text-[9px] uppercase font-bold text-slate-400 mt-1 tracking-wider">Estructura curricular</p>
          </div>
        </div>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <div id="modal-error" class="hidden p-3 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <svg class="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <span id="modal-error-txt"></span>
        </div>

        <!-- Name and Type -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 space-y-1.5">
            <label class="text-xs font-black text-slate-400 uppercase tracking-widest block">Nombre de la materia</label>
            <input type="text" id="subject-name" placeholder="Ej: Álgebra Lineal, Fisicoquímica..." class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold text-slate-700">
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-black text-slate-400 uppercase tracking-widest block">Estructura</label>
            <div class="grid grid-cols-2 bg-slate-150 p-1 rounded-2xl gap-0.5">
              <button type="button" onclick="setSubjectType('A')" id="type-btn-a" class="py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer bg-indigo-600 text-white">Simple (A)</button>
              <button type="button" onclick="setSubjectType('B')" id="type-btn-b" class="py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-slate-500">Secciones (B)</button>
            </div>
          </div>
        </div>

        <!-- approval settings -->
        <div class="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 class="text-xs font-black text-indigo-950 uppercase tracking-wider">Aprobación General</h4>
              <p class="text-[10px] text-indigo-650 font-semibold mt-0.5">Nota promedio con la que se aprueba la materia.</p>
            </div>
            <div class="flex items-center gap-1.5" id="passing-threshold-container">
              <button type="button" onclick="setThreshold('4')" class="threshold-btn px-3.5 py-2 text-xs font-black border rounded-xl bg-indigo-600 text-white border-indigo-600" data-val="4">4</button>
              <button type="button" onclick="setThreshold('6')" class="threshold-btn px-3.5 py-2 text-xs font-black border rounded-xl bg-white text-slate-600 border-slate-200" data-val="6">6</button>
              <button type="button" onclick="setThreshold('7')" class="threshold-btn px-3.5 py-2 text-xs font-black border rounded-xl bg-white text-slate-600 border-slate-200" data-val="7">7</button>
              <button type="button" onclick="setThreshold('custom')" class="threshold-btn px-3.5 py-2 text-xs font-black border rounded-xl bg-white text-slate-600 border-slate-200" id="threshold-btn-custom" data-val="custom">Personalizado</button>
            </div>
          </div>
          <div id="custom-threshold-row" class="hidden pt-3 border-t border-indigo-100 flex items-center gap-2">
            <span class="text-xs font-bold text-indigo-850">Nota requerida:</span>
            <input type="number" id="custom-threshold" min="1" max="10" step="0.1" placeholder="Ej: 5.5" class="w-20 text-center font-bold text-xs bg-white border border-indigo-200 p-2 rounded-xl outline-none" value="">
          </div>
        </div>

        <!-- EXAMS CONTAINER (FOR TIPO A) -->
        <div id="exams-container-a" class="space-y-4">
          <div class="flex items-center justify-between border-b pb-2">
            <div>
              <h4 class="text-xs font-black text-slate-705 uppercase tracking-wider">Plan de Exámenes</h4>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex bg-slate-100 p-0.5 rounded-xl border text-[9px] font-black">
                <button type="button" onclick="setModoA('simple')" id="modo-a-btn-simple" class="px-2 py-1 rounded-lg bg-white text-slate-800 shadow-sm">SIMPLE</button>
                <button type="button" onclick="setModoA('ponderado')" id="modo-a-btn-ponderado" class="px-2 py-1 rounded-lg text-slate-400">PONDERADO</button>
              </div>
              <button type="button" onclick="addExamenA()" class="text-xs font-black text-indigo-650 flex items-center gap-1 cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
                Agregar examen
              </button>
            </div>
          </div>
          <div id="exams-list-a" class="space-y-3">
            <!-- Dynamic simple exams list -->
          </div>
        </div>

        <!-- SECTIONS CONTAINER (FOR TIPO B) -->
        <div id="sections-container-b" class="space-y-6 hidden">
          <div class="flex items-center justify-between border-b pb-2">
            <div>
              <h4 class="text-xs font-black text-slate-705 uppercase tracking-wider">Carga de Secciones</h4>
            </div>
            <button type="button" onclick="addSeccionB()" class="px-3.5 py-2 bg-indigo-50 text-indigo-750 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
              Nueva Sección
            </button>
          </div>
          <div id="sections-list-b" class="space-y-6">
            <!-- Dynamic B sections lists -->
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-end gap-2">
        <button onclick="closeModal()" type="button" class="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-100 rounded-xl">Cancelar</button>
        <button onclick="saveSubject()" type="button" class="px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white bg-indigo-650 hover:bg-indigo-750 rounded-xl shadow shadow-indigo-100">Guardar Materia</button>
      </div>
    </div>
  </div>

  <script>
    // --- STANDALONE DATA STATE ---
    let materias = [];
    let editSubjectId = null;
    let selectedType = 'A';
    let selectedThreshold = '4';
    let modoA = 'simple';
    let statusFilter = 'all';

    // Temp arrays for editing in modal
    let tempExamenesA = [];
    let tempSeccionesB = [];

    // --- ON LOAD INITIALIZER ---
    window.onload = function() {
      const saved = localStorage.getItem('materias_universidad_data');
      if (saved) {
        try {
          materias = JSON.parse(saved);
        } catch(e) {
          materias = [];
        }
      }
      renderApp();
    };

    function saveState() {
      localStorage.setItem('materias_universidad_data', JSON.stringify(materias));
    }

    // --- FORMULA WORKINGS ---
    function obtenerNotaMinima(m) {
      if (m.notaMinimaRef === 'custom') {
        const parsed = parseFloat(m.notaMinimaCustom);
        return isNaN(parsed) ? 4 : parsed;
      }
      return parseInt(m.notaMinimaRef, 10);
    }

    function obtenerTodosExamenes(m) {
      if (m.tipo === 'B') {
        let list = [];
        (m.secciones || []).forEach(sec => {
          list.push(...(sec.examenes || []));
        });
        return list;
      }
      return m.examenes || [];
    }

    function obtenerExamenesEfectivos(m) {
      if (m.tipo === 'A') {
        let total = (m.examenes || []).length;
        if (total === 0) return [];
        if (m.modo === 'simple') {
          let eq = 100 / total;
          return m.examenes.map(ex => ({ examen: ex, pesoEfectivo: eq }));
        } else {
          return m.examenes.map(ex => ({ examen: ex, pesoEfectivo: ex.peso || 0 }));
        }
      } else {
        let list = [];
        (m.secciones || []).forEach(sec => {
          let totalSecEx = (sec.examenes || []).length;
          if (totalSecEx === 0) return;
          let pesoSec = sec.peso || 0;
          sec.examenes.forEach(ex => {
            let pesoInterno = sec.modo === 'simple' ? (100 / totalSecEx) : (ex.peso || 0);
            let pesoEfectivo = (pesoInterno * pesoSec) / 100;
            list.push({ examen: ex, pesoEfectivo: pesoEfectivo });
          });
        });
        return list;
      }
    }

    function calcularMateria(m) {
      const notaMinima = obtenerNotaMinima(m);
      const todosEx = obtenerTodosExamenes(m);

      if (todosEx.length === 0) {
        return { promedioActual: null, notaNecesaria: null, estado: 'sin_notas', mensaje: 'Cargá al menos una entrega' };
      }

      // Check mandatory requirements
      const falloReq = todosEx.find(ex => {
        if (ex.esRequisito && ex.nota !== undefined && ex.nota !== null && !isNaN(ex.nota)) {
          return ex.nota < (ex.notaRequisitoMinima || 4);
        }
        return false;
      });

      const eff = obtenerExamenesEfectivos(m);
      const rendidos = eff.filter(ee => ee.examen.nota !== undefined && ee.examen.nota !== null && !isNaN(ee.examen.nota));
      const pendientes = eff.filter(ee => ee.examen.nota === undefined || ee.examen.nota === null || isNaN(ee.examen.nota));

      if (rendidos.length === 0) {
        return { promedioActual: null, notaNecesaria: null, estado: 'sin_notas', mensaje: 'Cargá al menos una nota' };
      }

      const sumPesosRendidos = rendidos.reduce((sum, e) => sum + e.pesoEfectivo, 0);
      const promedioParcial = rendidos.reduce((sum, e) => sum + (e.examen.nota * e.pesoEfectivo), 0);
      const promedioActual = sumPesosRendidos > 0 ? (promedioParcial / sumPesosRendidos) : 0;

      if (falloReq) {
        return {
          promedioActual,
          notaNecesaria: null,
          estado: 'reprobado_requisito',
          mensaje: 'Reprobaste "' + falloReq.nombre + '" (' + falloReq.nota + ' < ' + (falloReq.notaRequisitoMinima || 4) + '), requisito obligatorio.'
        };
      }

      if (pendientes.length === 0) {
        const aprobado = promedioActual >= notaMinima;
        return {
          promedioActual,
          notaNecesaria: null,
          estado: aprobado ? 'aprobado' : 'imposible',
          mensaje: aprobado ? '¡Ya aprobaste con ' + promedioActual.toFixed(2) + '!' : 'Es imposible alcanzar el promedio de aprobación'
        };
      }

      const sumPesosPendientes = pendientes.reduce((sum, e) => sum + e.pesoEfectivo, 0);
      if (sumPesosPendientes <= 0) {
        return { promedioActual, notaNecesaria: null, estado: 'en_curso', mensaje: 'Defina pesos en pendientes para calcular' };
      }

      const notaNecesaria = (notaMinima * 100 - promedioParcial) / sumPesosPendientes;

      if (notaNecesaria <= 0) {
        return { promedioActual, notaNecesaria: 0, estado: 'aprobado', mensaje: '¡Ya aprobaste sin rendir lo restante!' };
      } else if (notaNecesaria > 10) {
        return { promedioActual, notaNecesaria: null, estado: 'imposible', mensaje: 'Imposible de aprobar (requerido: ' + notaNecesaria.toFixed(2) + ')' };
      } else {
        return { promedioActual, notaNecesaria, estado: 'en_curso', mensaje: 'Necesitás sacar ' + notaNecesaria.toFixed(2) + ' de promedio' };
      }
    }

    // --- RENDER FUNCTIONS ---
    function renderApp() {
      const emptyStateEl = document.getElementById('empty-state');
      const statsPanelEl = document.getElementById('dashboard-stats');
      const searchBarEl = document.getElementById('search-filter-bar');
      const container = document.getElementById('materias-container');

      const searchQuery = document.getElementById('search-input').value.toLowerCase();

      if (materias.length === 0) {
        emptyStateEl.classList.remove('hidden');
        statsPanelEl.classList.add('hidden');
        searchBarEl.classList.add('hidden');
        container.innerHTML = '';
        return;
      }

      emptyStateEl.classList.add('hidden');
      statsPanelEl.classList.remove('hidden');
      searchBarEl.classList.remove('hidden');

      // Filter and render
      let filtered = materias.filter(m => {
        const calc = calcularMateria(m);
        const matchSearch = m.nombre.toLowerCase().includes(searchQuery);
        const matchFilter = statusFilter === 'all' || calc.estado === statusFilter;
        return matchSearch && matchFilter;
      });

      // Calculate general stats
      let aprobadasCount = 0;
      let enCursoCount = 0;
      let sumPromedios = 0;
      let countPromedios = 0;

      materias.forEach(m => {
        const calc = calcularMateria(m);
        if (calc.estado === 'aprobado') aprobadasCount++;
        else if (calc.estado === 'en_curso') enCursoCount++;

        if (calc.promedioActual !== null) {
          sumPromedios += calc.promedioActual;
          countPromedios++;
        }
      });

      document.getElementById('stat-total').innerText = materias.length;
      document.getElementById('stat-aprobado').innerText = aprobadasCount;
      document.getElementById('stat-encurso').innerText = enCursoCount;
      document.getElementById('stat-promedio').innerText = countPromedios > 0 ? (sumPromedios / countPromedios).toFixed(2) : '-';

      // Load Grid Cards
      container.innerHTML = '';
      if (filtered.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-8 text-xs font-semibold text-slate-400">Ninguna materia coincide con el filtro activo.</div>';
        return;
      }

      filtered.forEach(m => {
        const calc = calcularMateria(m);
        const notaMin = obtenerNotaMinima(m);

        let borderClass = 'border-slate-300';
        let badgeHTML = '';

        if (calc.estado === 'aprobado') {
          borderClass = 'border-emerald-400';
          badgeHTML = '<span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">✅ Aprobado</span>';
        } else if (calc.estado === 'en_curso') {
          borderClass = 'border-amber-400';
          badgeHTML = '<span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⚠️ En curso</span>';
        } else if (calc.estado === 'reprobado_requisito') {
          borderClass = 'border-rose-400';
          badgeHTML = '<span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700">❌ Requisito</span>';
        } else if (calc.estado === 'imposible') {
          borderClass = 'border-rose-400';
          badgeHTML = '<span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">❌ Imposible</span>';
        } else if (calc.estado === 'sin_notas') {
          borderClass = 'border-slate-350';
          badgeHTML = '<span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-705">⬜ Sin notas</span>';
        }

        const totalExs = obtenerTodosExamenes(m);

        let cardBodyHTML = '';
        if (calc.estado === 'aprobado') {
          cardBodyHTML = \`
            <div class="bg-emerald-50/80 p-4 rounded-xl border border-emerald-100 text-center">
              <p class="text-[9px] text-emerald-700 font-black uppercase tracking-wider">¡Cursada Aprobada!</p>
              <p class="text-3xl font-black text-emerald-800 mt-1">\${calc.promedioActual !== null ? calc.promedioActual.toFixed(2) : '-'}</p>
              <p class="text-[10px] text-emerald-600 font-bold mt-1 leading-snug">Ya alcanzaste la meta requerida</p>
            </div>
          \`;
        } else if (calc.estado === 'en_curso') {
          cardBodyHTML = \`
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-150">
              <div class="flex justify-between items-end">
                <div>
                  <p class="text-[9px] text-slate-400 font-black uppercase leading-none">Promedio actual</p>
                  <p class="text-2xl font-black text-slate-800 mt-1">\${calc.promedioActual !== null ? calc.promedioActual.toFixed(2) : '-'}</p>
                </div>
                <div class="text-right">
                  <p class="text-[9px] text-slate-400 font-black uppercase leading-none">Necesitás</p>
                  <p class="text-xl font-black text-indigo-650 mt-1">\${calc.notaNecesaria !== null ? calc.notaNecesaria.toFixed(2) : '-'}</p>
                </div>
              </div>
              <p class="text-[10px] text-slate-500 font-bold mt-2.5 text-center pt-2 border-t border-dashed border-slate-200">
                Alcanzar <span class="text-slate-800">\${calc.notaNecesaria !== null ? calc.notaNecesaria.toFixed(2) : '-'}</span> de promedio restante.
              </p>
            </div>
          \`;
        } else if (calc.estado === 'reprobado_requisito') {
          cardBodyHTML = \`
            <div class="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
              <p class="text-[9px] text-red-700 font-black uppercase tracking-wider">Requisito Obligatorio Fallado</p>
              <p class="text-sm font-semibold text-red-800 mt-1.5 leading-snug">\${calc.mensaje}</p>
            </div>
          \`;
        } else if (calc.estado === 'imposible') {
          cardBodyHTML = \`
            <div class="bg-rose-50/80 p-4 rounded-xl border border-rose-100 text-center">
              <p class="text-[9px] text-rose-700 font-black uppercase tracking-wider">Materia Crítica</p>
              <p class="text-2xl font-black text-rose-800 mt-1">\${calc.promedioActual !== null ? calc.promedioActual.toFixed(2) : '-'}</p>
              <p class="text-[10px] text-rose-600 font-extrabold mt-1 leading-snug">Con tus notas es imposible alcanzar la mínima.</p>
            </div>
          \`;
        } else {
          cardBodyHTML = \`
            <div class="bg-slate-50 p-4 rounded-xl text-center border">
              <p class="text-xs font-bold text-slate-500">No hay calificaciones cargadas</p>
              <p class="text-[10px] text-slate-400 font-semibold mt-1">Editá la materia para registrar notas o hitos.</p>
            </div>
          \`;
        }

        // Mini status checklist inside the card
        let listHTML = '';
        try {
          const listEx = obtenerExamenesEfectivos(m);
          if (listEx.length > 0) {
            listHTML = '<div class="space-y-1.5 pt-1 border-t border-slate-100 mt-2">';
            listEx.slice(0, 4).forEach(ee => {
              const statusSymbol = ee.examen.nota !== undefined && ee.examen.nota !== null ? \`<span class="text-indigo-600 font-extrabold">\${ee.examen.nota}</span>\` : '<span class="text-slate-300">Pend.</span>';
              const reqAsterisk = ee.examen.esRequisito ? '<span class="text-red-500" title="Requisito Obligatorio">*</span>' : '';
              listHTML += \`
                <div class="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                  <span class="truncate pr-2">\${ee.examen.nombre}\${reqAsterisk}</span>
                  <span>\${statusSymbol}</span>
                </div>
              \`;
            });
            if (listEx.length > 4) {
              listHTML += \`<div class="text-[8px] text-slate-400 font-bold text-right">+ \${listEx.length - 4} exámenes rindiendo</div>\`;
            }
            listHTML += '</div>';
          }
        } catch(e) {}

        const card = document.createElement('div');
        card.className = 'bg-white rounded-3xl card-shadow border-l-4 ' + borderClass + ' flex flex-col justify-between overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-md';
        card.innerHTML = \`
          <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div class="flex justify-between items-start gap-2">
              \${badgeHTML}
              <div class="flex items-center gap-1">
                <button onclick="editSubject('\${m.id}')" class="p-1 px-2 text-[10px] font-black uppercase text-indigo-500 hover:bg-indigo-50 rounded-lg">Editar</button>
                <button onclick="deleteSubject('\${m.id}')" class="p-1 px-2 text-[10px] font-black uppercase text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg">Borrar</button>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">\${m.nombre}</h3>
              <p class="text-[9px] font-extrabold text-slate-450 mt-1 uppercase tracking-wider">
                \${m.tipo === 'B' ? 'Secciones' : (m.modo === 'simple' ? 'Simple' : 'Ponderado')} • Min. Aprobación: \${notaMin}
              </p>
            </div>

            <div class="flex-1 flex flex-col justify-center">
              \${cardBodyHTML}
            </div>

            \${listHTML}
          </div>

          <div class="px-6 py-3 bg-slate-50/60 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400">
            <span>\${totalExs.length} examen\${totalExs.length !== 1 ? 'es' : ''}</span>
            <span class="uppercase text-[8px] tracking-widest font-black text-slate-350">auto-save</span>
          </div>
        \`;
        container.appendChild(card);
      });
    }

    function setStatusFilter(filter) {
      statusFilter = filter;
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.className = 'filter-btn px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200';
      });
      const activeBtn = document.getElementById('btn-filter-' + filter);
      if (activeBtn) {
        if (filter === 'all') activeBtn.className = 'filter-btn px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-indigo-700 text-white shadow-sm';
        else if (filter === 'aprobado') activeBtn.className = 'filter-btn px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-emerald-600 text-white shadow-sm';
        else if (filter === 'en_curso') activeBtn.className = 'filter-btn px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-indigo-600 text-white shadow-sm';
        else if (filter === 'imposible') activeBtn.className = 'filter-btn px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-rose-600 text-white shadow-sm';
      }
      renderApp();
    }

    // --- SEARCH WATCHER ---
    document.getElementById('search-input').addEventListener('input', renderApp);

    // --- DEMO SEED ---
    function cargarDemos() {
      materias = [
        {
          id: 'demo-analisis',
          nombre: 'Análisis Matemático I',
          tipo: 'A',
          notaMinimaRef: '4',
          modo: 'ponderado',
          examenes: [
            { id: 'exA1', nombre: 'Parcial I', peso: 40, nota: 2 },
            { id: 'exA2', nombre: 'TP Grupal', peso: 20, nota: 8 },
            { id: 'exA3', nombre: 'Parcial II', peso: 40, nota: null, esRequisito: true, notaRequisitoMinima: 4 },
          ]
        },
        {
          id: 'demo-fisica',
          nombre: 'Física I (Seccionales)',
          tipo: 'B',
          notaMinimaRef: '6',
          secciones: [
            {
              id: 'sec1',
              nombre: 'Primer Bimestre (Mecánica) • 50%',
              peso: 50,
              modo: 'simple',
              examenes: [
                { id: 'f1', nombre: 'Teórico Mecánica', nota: 6, esRequisito: true, notaRequisitoMinima: 4 },
                { id: 'f2', nombre: 'Práctico Mecánica', nota: 7 },
              ]
            },
            {
              id: 'sec2',
              nombre: 'Segundo Bimestre (Termo) • 50%',
              peso: 50,
              modo: 'simple',
              examenes: [
                { id: 'f3', nombre: 'Trabajo Especial', nota: 8 },
                { id: 'f4', nombre: 'Parcial Termodinámica', nota: null, esRequisito: true, notaRequisitoMinima: 5 }
              ]
            }
          ]
        }
      ];
      saveState();
      renderApp();
    }

    // --- DELETE / RESET ---
    function deleteSubject(id) {
      if (confirm('¿Borrar materia de la lista?')) {
        materias = materias.filter(m => m.id !== id);
        saveState();
        renderApp();
      }
    }

    document.getElementById('btn-vaciar').addEventListener('click', () => {
      if (confirm('¿Vaciar y borrar todo el espacio de trabajo local?')) {
        materias = [];
        saveState();
        renderApp();
      }
    });

    // --- MODAL AND FORM LOGIC ---
    document.getElementById('btn-nueva-materia').addEventListener('click', () => openModal());
    document.getElementById('btn-crear-primer').addEventListener('click', () => openModal());

    function openModal(id = null) {
      editSubjectId = id;
      document.getElementById('modal-error').classList.add('hidden');
      
      if (id) {
        document.getElementById('modal-title').innerText = 'Editar Materia';
        const m = materias.find(sub => sub.id === id);
        document.getElementById('subject-name').value = m.nombre;
        selectedType = m.tipo || 'A';
        selectedThreshold = m.notaMinimaRef || '4';
        
        if (m.notaMinimaRef === 'custom') {
          document.getElementById('custom-threshold').value = m.notaMinimaCustom || '';
        } else {
          document.getElementById('custom-threshold').value = '';
        }

        if (selectedType === 'A') {
          modoA = m.modo || 'simple';
          tempExamenesA = JSON.parse(JSON.stringify(m.examenes || []));
          tempSeccionesB = [];
        } else {
          tempSeccionesB = JSON.parse(JSON.stringify(m.secciones || []));
          tempExamenesA = [];
        }
      } else {
        document.getElementById('modal-title').innerText = 'Nueva Materia';
        document.getElementById('subject-name').value = '';
        selectedType = 'A';
        selectedThreshold = '4';
        modoA = 'simple';
        document.getElementById('custom-threshold').value = '';
        
        tempExamenesA = [
          { id: 'ex_s1', nombre: 'Parcial I', nota: null, peso: 50 },
          { id: 'ex_s2', nombre: 'Parcial II', nota: null, peso: 50 }
        ];
        
        tempSeccionesB = [
          {
            id: 'sec_1',
            nombre: 'Primer Cuatrimestre',
            peso: 50,
            modo: 'simple',
            examenes: [{ id: 'b_ex1', nombre: 'Parcial I', nota: null }]
          },
          {
            id: 'sec_2',
            nombre: 'Segundo Cuatrimestre',
            peso: 50,
            modo: 'simple',
            examenes: [{ id: 'b_ex2', nombre: 'Parcial II', nota: null }]
          }
        ];
      }

      updateModalView();
      document.getElementById('modal-materia').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('modal-materia').classList.add('hidden');
    }

    function setSubjectType(type) {
      if (selectedType === type) return;
      selectedType = type;
      
      // Convert seamlessly
      if (type === 'B' && tempSeccionesB.length === 0) {
        tempSeccionesB = [{
          id: 'cv_sec',
          nombre: 'Módulo Principal',
          peso: 100,
          modo: modoA,
          examenes: JSON.parse(JSON.stringify(tempExamenesA))
        }];
      } else if (type === 'A' && tempExamenesA.length === 0) {
        let list = [];
        tempSeccionesB.forEach(s => {
          list.push(...(s.examenes || []));
        });
        tempExamenesA = list.length > 0 ? list : [{ id: 'e1', nombre: 'Parcial 1', nota: null }];
        modoA = 'simple';
      }

      updateModalView();
    }

    function setThreshold(val) {
      selectedThreshold = val;
      document.querySelectorAll('.threshold-btn').forEach(btn => {
        btn.className = 'threshold-btn px-3.5 py-2 text-xs font-black border rounded-xl bg-white text-slate-600 border-slate-200';
      });
      
      const thresholdBtns = document.querySelectorAll('.threshold-btn');
      thresholdBtns.forEach(btn => {
        if (btn.getAttribute('data-val') === val) {
          btn.className = 'threshold-btn px-3.5 py-2 text-xs font-black border rounded-xl bg-indigo-600 text-white border-indigo-600';
        }
      });

      if (val === 'custom') {
        document.getElementById('custom-threshold-row').classList.remove('hidden');
      } else {
        document.getElementById('custom-threshold-row').classList.add('hidden');
      }
    }

    function setModoA(modo) {
      modoA = modo;
      document.getElementById('modo-a-btn-simple').className = modo === 'simple' ? 'px-2 py-1 rounded-lg bg-white text-slate-800 shadow-sm' : 'px-2 py-1 rounded-lg text-slate-400';
      document.getElementById('modo-a-btn-ponderado').className = modo === 'ponderado' ? 'px-2 py-1 rounded-lg bg-white text-slate-800 shadow-sm' : 'px-2 py-1 rounded-lg text-slate-400';
      
      updateExamsListViewA();
    }

    function updateModalView() {
      // Toggle Type Button Highlights
      document.getElementById('type-btn-a').className = selectedType === 'A' ? 'py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer bg-indigo-650 bg-indigo-600 text-white' : 'py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-slate-500';
      document.getElementById('type-btn-b').className = selectedType === 'B' ? 'py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer bg-indigo-650 bg-indigo-600 text-white' : 'py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-slate-500';

      setThreshold(selectedThreshold);

      if (selectedType === 'A') {
        document.getElementById('exams-container-a').classList.remove('hidden');
        document.getElementById('sections-container-b').classList.add('hidden');
        setModoA(modoA);
      } else {
        document.getElementById('exams-container-a').classList.add('hidden');
        document.getElementById('sections-container-b').classList.remove('hidden');
        updateSectionsListViewB();
      }
    }

    // --- REVIEWS LIST SUBVIEWS (TIPO A) ---
    function addExamenA() {
      tempExamenesA.push({
        id: Math.random().toString(36).substring(2, 9),
        nombre: 'Examen ' + (tempExamenesA.length + 1),
        nota: null,
        peso: 25
      });
      updateExamsListViewA();
    }

    function removeExamenA(id) {
      tempExamenesA = tempExamenesA.filter(e => e.id !== id);
      updateExamsListViewA();
    }

    function changeExamenA(id, key, val) {
      tempExamenesA = tempExamenesA.map(e => {
        if (e.id !== id) return e;
        
        let update = { ...e };
        if (key === 'nota') {
          if (val === '') update.nota = null;
          else {
            let n = parseFloat(val);
            update.nota = isNaN(n) ? null : Math.min(10, Math.max(0, n));
          }
        } else if (key === 'peso') {
          if (val === '') update.peso = 0;
          else {
            let p = parseInt(val, 10);
            update.peso = isNaN(p) ? 0 : Math.min(100, Math.max(0, p));
          }
        } else if (key === 'esRequisito') {
          update.esRequisito = val;
          if (val && !update.notaRequisitoMinima) update.notaRequisitoMinima = 4;
        } else if (key === 'notaRequisitoMinima') {
          let n = parseFloat(val);
          update.notaRequisitoMinima = isNaN(n) ? 4 : Math.min(10, Math.max(1, n));
        } else {
          update[key] = val;
        }

        return update;
      });
    }

    function updateExamsListViewA() {
      const container = document.getElementById('exams-list-a');
      container.innerHTML = '';

      if (tempExamenesA.length === 0) {
        container.innerHTML = '<div class="text-[11px] font-bold text-slate-400 text-center py-4">Haga clic en agregar examen para iniciar.</div>';
        return;
      }

      tempExamenesA.forEach((ex, idx) => {
        const row = document.createElement('div');
        row.className = 'p-3 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col space-y-2';

        const reqHTML = ex.esRequisito ? \`
          <div class="flex items-center gap-2 pl-4 border-l border-slate-200">
            <span class="text-[9px] uppercase font-bold text-slate-400">Exigencia:</span>
            <input type="number" min="1" max="10" step="0.5" value="\${ex.notaRequisitoMinima || 4}" oninput="changeExamenA('\${ex.id}', 'notaRequisitoMinima', this.value)" class="w-12 text-center bg-transparent border-b text-xs font-black text-indigo-700 outline-none pb-0.5">
          </div>
        \` : '';

        row.innerHTML = \`
          <div class="flex flex-wrap md:flex-nowrap items-center gap-3">
            <span class="text-[9px] font-black text-slate-400 bg-slate-200 w-5 h-5 rounded flex items-center justify-center shrink-0">\${idx + 1}</span>
            <div class="flex-1 min-w-[150px]">
              <input type="text" value="\${ex.nombre}" oninput="changeExamenA('\${ex.id}', 'nombre', this.value)" placeholder="Ej: Parcial" class="w-full bg-transparent border-b border-dashed border-slate-300 pb-0.5 font-bold text-xs text-slate-700 focus:border-indigo-400 outline-none">
            </div>
            \${modoA === 'ponderado' ? \`
              <div class="w-24 shrink-0 flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5">
                <span class="text-[9px] font-black text-slate-400">PESO:</span>
                <input type="number" min="0" max="100" value="\${ex.peso !== undefined && ex.peso !== null ? ex.peso : ''}" oninput="changeExamenA('\${ex.id}', 'peso', this.value)" placeholder="%" class="w-full text-right outline-none bg-transparent text-xs font-bold text-slate-705">
                <span class="text-xs font-bold text-slate-400">%</span>
              </div>
            \` : ''}
            <div class="w-28 shrink-0 flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5">
              <span class="text-[9px] font-black text-slate-400">NOTA:</span>
              <input type="number" min="0" max="10" step="0.1" value="\${ex.nota !== undefined && ex.nota !== null ? ex.nota : ''}" oninput="changeExamenA('\${ex.id}', 'nota', this.value)" placeholder="Pend." class="w-full text-center outline-none bg-transparent text-xs font-bold text-slate-705">
            </div>
            <button type="button" onclick="removeExamenA('\${ex.id}')" class="p-1 px-2 text-rose-500 rounded hover:bg-rose-50 text-[10px] font-bold">Borrar</button>
          </div>
          <div class="flex items-center gap-4 text-[10px]">
            <label class="flex items-center gap-1.5 font-bold text-slate-500 cursor-pointer select-none">
              <input type="checkbox" \${ex.esRequisito ? 'checked' : ''} onchange="changeExamenA('\${ex.id}', 'esRequisito', this.checked); updateExamsListViewA();" class="accent-indigo-650 cursor-pointer">
              ¿Tiene exigencia de requisito obligatorio?
            </label>
            \${reqHTML}
          </div>
        \`;
        container.appendChild(row);
      });
    }

    // --- REVIEWS LIST SUBVIEWS (TIPO B) ---
    function addSeccionB() {
      const id = Math.random().toString(36).substring(2, 9);
      let sum = tempSeccionesB.reduce((s, sec) => s + (sec.peso || 0), 0);
      tempSeccionesB.push({
        id,
        nombre: 'Sección ' + (tempSeccionesB.length + 1),
        peso: Math.max(0, 100 - sum),
        modo: 'simple',
        examenes: [{ id: Math.random().toString(36).substring(2, 9), nombre: 'Parcial I', nota: null }]
      });
      updateSectionsListViewB();
    }

    function removeSeccionB(secId) {
      tempSeccionesB = tempSeccionesB.filter(s => s.id !== secId);
      updateSectionsListViewB();
    }

    function changeSeccionB(secId, key, val) {
      tempSeccionesB = tempSeccionesB.map(sec => {
        if (sec.id !== secId) return sec;
        
        let update = { ...sec };
        if (key === 'peso') {
          let p = parseInt(val, 10);
          update.peso = isNaN(p) ? 0 : Math.min(100, Math.max(0, p));
        } else {
          update[key] = val;
        }
        return update;
      });
    }

    function addExamenSeccionB(secId) {
      tempSeccionesB = tempSeccionesB.map(sec => {
        if (sec.id !== secId) return sec;
        const exId = Math.random().toString(36).substring(2, 9);
        return {
          ...sec,
          examenes: [...sec.examenes, { id: exId, nombre: 'Examen ' + (sec.examenes.length + 1), nota: null, peso: 50 }]
        };
      });
      updateSectionsListViewB();
    }

    function removeExamenSeccionB(secId, exId) {
      tempSeccionesB = tempSeccionesB.map(sec => {
        if (sec.id !== secId) return sec;
        return { ...sec, examenes: sec.examenes.filter(e => e.id !== exId) };
      });
      updateSectionsListViewB();
    }

    function changeExamenSeccionB(secId, exId, key, val) {
      tempSeccionesB = tempSeccionesB.map(sec => {
        if (sec.id !== secId) return sec;
        let updateEx = sec.examenes.map(ex => {
          if (ex.id !== exId) return ex;
          let u = { ...ex };
          if (key === 'nota') {
            if (val === '') u.nota = null;
            else {
              let n = parseFloat(val);
              u.nota = isNaN(n) ? null : Math.min(10, Math.max(0, n));
            }
          } else if (key === 'peso') {
            if (val === '') u.peso = 0;
            else {
              let p = parseInt(val, 10);
              u.peso = isNaN(p) ? 0 : Math.min(100, Math.max(0, p));
            }
          } else if (key === 'esRequisito') {
            u.esRequisito = val;
            if (val && !u.notaRequisitoMinima) u.notaRequisitoMinima = 4;
          } else if (key === 'notaRequisitoMinima') {
            let n = parseFloat(val);
            u.notaRequisitoMinima = isNaN(n) ? 4 : Math.min(10, Math.max(1, n));
          } else {
            u[key] = val;
          }
          return u;
        });
        return { ...sec, examenes: updateEx };
      });
    }

    function updateSectionsListViewB() {
      const container = document.getElementById('sections-list-b');
      container.innerHTML = '';

      if (tempSeccionesB.length === 0) {
        container.innerHTML = '<div class="text-[11px] font-bold text-slate-400 text-center py-4">Inicie agregando secciones para su materia.</div>';
        return;
      }

      tempSeccionesB.forEach((sec, sIdx) => {
        const secCard = document.createElement('div');
        secCard.className = 'p-5 bg-white border-2 border-slate-200 rounded-3xl space-y-4';

        let examsHTML = '';
        sec.examenes.forEach((ex, eIdx) => {
          const nestedReqHTML = ex.esRequisito ? \`
            <div class="flex items-center gap-1.5 pl-3 border-l border-slate-200">
              <span class="text-[9px] uppercase font-bold text-slate-400">Min:</span>
              <input type="number" min="1" max="10" step="0.5" value="\&lt;\${ex.notaRequisitoMinima || 4}\&gt;" oninput="changeExamenSeccionB('\${sec.id}', '\${ex.id}', 'notaRequisitoMinima', this.value)" class="w-10 text-center bg-transparent border-b border-indigo-400 text-xs font-black text-indigo-700 outline-none">
            </div>
          \` : '';

          examsHTML += \`
            <div class="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
              <div class="flex flex-wrap md:flex-nowrap items-center gap-2">
                <span class="text-[8px] font-bold text-slate-400 bg-slate-200 w-4 h-4 rounded flex items-center justify-centershrink-0">\${eIdx + 1}</span>
                <div class="flex-1 min-w-[120px]">
                  <input type="text" value="\${ex.nombre}" oninput="changeExamenSeccionB('\${sec.id}', '\${ex.id}', 'nombre', this.value)" placeholder="Nombre del examen" class="w-full bg-transparent border-b border-slate-200 font-bold text-xs text-slate-700 outline-none focus:border-indigo-400">
                </div>
                \${sec.modo === 'ponderado' ? \`
                  <div class="w-20 shrink-0 flex items-center gap-1 bg-white border rounded">
                    <input type="number" min="0" max="100" value="\${ex.peso !== undefined && ex.peso !== null ? ex.peso : ''}" oninput="changeExamenSeccionB('\${sec.id}', '\${ex.id}', 'peso', this.value)" placeholder="%" class="w-full text-right outline-none text-xs font-bold text-slate-700 pr-1">%
                  </div>
                \` : ''}
                <div class="w-24 shrink-0 flex items-center gap-1 bg-white border rounded-lg px-2 py-1">
                  <span class="text-[8px] font-bold text-slate-350">NOTA:</span>
                  <input type="number" min="0" max="10" step="0.1" value="\${ex.nota !== undefined && ex.nota !== null ? ex.nota : ''}" oninput="changeExamenSeccionB('\${sec.id}', '\${ex.id}', 'nota', this.value)" placeholder="Pend." class="w-full text-center outline-none text-xs font-bold text-slate-700">
                </div>
                <button type="button" onclick="removeExamenSeccionB('\${sec.id}', '\${ex.id}')" class="text-[9px] text-red-500 font-bold">Borrar</button>
              </div>
              <div class="flex items-center gap-4 text-[9px]">
                <label class="flex items-center gap-1 font-bold text-slate-450 cursor-pointer select-none">
                  <input type="checkbox" \${ex.esRequisito ? 'checked' : ''} onchange="changeExamenSeccionB('\${sec.id}', '\${ex.id}', 'esRequisito', this.checked); updateSectionsListViewB();" class="accent-indigo-650 cursor-pointer">
                  ¿Requisito obligatorio de sección?
                </label>
                \${nestedReqHTML}
              </div>
            </div>
          \`;
        });

        secCard.innerHTML = \`
          <div class="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-3">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-black text-indigo-705 bg-indigo-50 p-1.5 rounded-lg">Sec. \${sIdx + 1}</span>
              <input type="text" value="\${sec.nombre}" oninput="changeSeccionB('\${sec.id}', 'nombre', this.value)" placeholder="Nombre de sección" class="bg-transparent border-b border-slate-300 font-extrabold text-sm text-slate-800 outline-none">
            </div>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1 bg-slate-50 border rounded px-2 py-1">
                <span class="text-[9px] font-black text-slate-400">PESO FINAL:</span>
                <input type="number" min="0" max="100" value="\${sec.peso}" oninput="changeSeccionB('\${sec.id}', 'peso', this.value)" class="w-8 text-right outline-none text-xs font-black text-indigo-600 bg-transparent">
                <span class="text-[9px] font-bold text-slate-455">%</span>
              </div>
              <div class="flex bg-slate-100 p-0.5 rounded text-[8px] font-black">
                <button type="button" onclick="changeSeccionB('\${sec.id}', 'modo', 'simple'); updateSectionsListViewB();" class="px-1.5 py-0.5 rounded \${sec.modo === 'simple' ? 'bg-white text-slate-800 shadow' : 'text-slate-400'}" id="modo-b-\${sec.id}-s">SIMPLE</button>
                <button type="button" onclick="changeSeccionB('\${sec.id}', 'modo', 'ponderado'); updateSectionsListViewB();" class="px-1.5 py-0.5 rounded \${sec.modo === 'ponderado' ? 'bg-white text-slate-800 shadow' : 'text-slate-400'}" id="modo-b-\${sec.id}-p">POND.</button>
              </div>
              <button type="button" onclick="removeSeccionB('\${sec.id}')" class="text-xs font-bold text-slate-405 hover:text-red-500">Borrar</button>
            </div>
          </div>

          <div class="space-y-2">
            \${examsHTML}
          </div>

          <button type="button" onclick="addExamenSeccionB('\${sec.id}')" class="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
            AGREGAR EXAMEN A SECCIÓN
          </button>
        \`;

        container.appendChild(secCard);
      });
    }

    // --- SAVE ACTION ---
    function saveSubject() {
      const name = document.getElementById('subject-name').value.trim();
      const errEl = document.getElementById('modal-error');
      const errTxt = document.getElementById('modal-error-txt');

      if (!name) {
        errEl.classList.remove('hidden');
        errTxt.innerText = 'Por favor, ingrese el nombre de la materia.';
        return;
      }

      let customMin = null;
      if (selectedThreshold === 'custom') {
        let val = parseFloat(document.getElementById('custom-threshold').value);
        if (isNaN(val) || val < 1 || val > 10) {
          errEl.classList.remove('hidden');
          errTxt.innerText = 'La nota personalizada debe configurarse entre 1 y 10.';
          return;
        }
        customMin = val;
      }

      let dataToSave = {
        id: editSubjectId || Math.random().toString(36).substring(2, 9),
        nombre: name,
        tipo: selectedType,
        notaMinimaRef: selectedThreshold,
        notaMinimaCustom: customMin,
      };

      if (selectedType === 'A') {
        if (tempExamenesA.length === 0) {
          errEl.classList.remove('hidden');
          errTxt.innerText = 'Debe agregar al menos un examen.';
          return;
        }
        const findEmpty = tempExamenesA.some(ex => !ex.nombre.trim());
        if (findEmpty) {
          errEl.classList.remove('hidden');
          errTxt.innerText = 'Todos los exámenes deben poseer un nombre asignado.';
          return;
        }

        dataToSave.modo = modoA;
        dataToSave.examenes = tempExamenesA.map(e => ({
          ...e,
          nombre: e.nombre.trim(),
          peso: modoA === 'ponderado' ? (e.peso || 0) : undefined
        }));
        dataToSave.secciones = [];

        if (modoA === 'ponderado') {
          let sum = tempExamenesA.reduce((s, x) => s + (x.peso || 0), 0);
          if (sum !== 100) {
            if (!confirm('Los pesos de exámenes suman ' + sum + '%. ¿Desea guardarlo igualmente?')) return;
          }
        }
      } else {
        if (tempSeccionesB.length === 0) {
          errEl.classList.remove('hidden');
          errTxt.innerText = 'Debe configurar al menos una sección formativa.';
          return;
        }

        // Validate sections
        for (let sec of tempSeccionesB) {
          if (!sec.nombre.trim()) {
            errEl.classList.remove('hidden');
            errTxt.innerText = 'Complete los nombres de todas las secciones.';
            return;
          }
          if (sec.examenes.length === 0) {
            errEl.classList.remove('hidden');
            errTxt.innerText = 'La sección "' + sec.nombre + '" no posee exámenes asignados.';
            return;
          }
          const findEmpty = sec.examenes.some(ex => !ex.nombre.trim());
          if (findEmpty) {
            errEl.classList.remove('hidden');
            errTxt.innerText = 'Cada examen en las secciones debe poseer su propio nombre.';
            return;
          }
        }

        // Sum of section weights check
        let sumSec = tempSeccionesB.reduce((s, x) => s + (x.peso || 0), 0);
        if (sumSec !== 100) {
          if (!confirm('Los pesos de secciones asignados suman ' + sumSec + '%. ¿Desea continuar igualmente?')) return;
        }

        dataToSave.modo = 'simple';
        dataToSave.examenes = [];
        dataToSave.secciones = tempSeccionesB.map(sec => ({
          ...sec,
          nombre: sec.nombre.trim(),
          examenes: sec.examenes.map(ex => ({
            ...ex,
            nombre: ex.nombre.trim(),
            peso: sec.modo === 'ponderado' ? (ex.peso || 0) : undefined
          }))
        }));
      }

      // Merge on state list
      const idx = materias.findIndex(e => e.id === dataToSave.id);
      if (idx >= 0) {
        materias[idx] = dataToSave;
      } else {
        materias.push(dataToSave);
      }

      saveState();
      closeModal();
      renderApp();
    }

    // --- REVIEWS LIST SECTIONS INNERS ---
    function editSubject(id) {
      openModal(id);
    }
  </script>
</body>
</html>`;
}
