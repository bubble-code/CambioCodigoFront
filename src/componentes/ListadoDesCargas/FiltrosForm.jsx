// src/components/ListadoDeCarga/FiltrosForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

const FiltrosForm = ({ onSubmit, onReset, loading }) => {
  const [idSeccion, setIdSeccion] = useState('');
  const [fechaDesde, setFechaDesde] = useState(new Date().toISOString().split('T')[0]);
  const [fechaHasta, setFechaHasta] = useState(new Date().toISOString().split('T')[0]);
  const [filtros, setFiltros] = useState({
    hijos: true,
    ofMas10Ops: true,
    reprocesos: true,
    bin: true,
    sinOrigen: true,
  });

  const handleFiltroChange = (e) => {
    const { name, checked } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      idSeccion,
      fechaDesde,
      fechaHasta,
      filtros,
    });
  };

  const handleFormReset = () => {
    setIdSeccion('');
    setFechaDesde(new Date().toISOString().split('T')[0]);
    setFechaHasta(new Date().toISOString().split('T')[0]);
    setFiltros({
      hijos: true,
      ofMas10Ops: true,
      reprocesos: true,
      bin: true,
      sinOrigen: true,
    });
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} onReset={handleFormReset} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div className="md:col-span-2 hidden">
          <label htmlFor="idSeccion" className="block text-sm font-medium text-gray-700 mb-1">
            Centro
          </label>
          <input
            type="text"
            id="idSeccion"
            value={idSeccion}
            onChange={(e) => setIdSeccion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 1200"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="fechaDesde" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Desde
          </label>
          <input
            type="date"
            id="fechaDesde"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="fechaHasta" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Hasta
          </label>
          <input
            type="date"
            id="fechaHasta"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-3 flex items-end space-x-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Buscando...
              </span>
            ) : (
              'Consultar'
            )}
          </button>

          <button
            type="reset"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hijos"
            name="hijos"
            checked={filtros.hijos}
            onChange={handleFiltroChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hijos" className="ml-2 block text-sm text-gray-700">
            Hijos
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="ofMas10Ops"
            name="ofMas10Ops"
            checked={filtros.ofMas10Ops}
            onChange={handleFiltroChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="ofMas10Ops" className="ml-2 block text-sm text-gray-700">
            OF +10 ops
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="reprocesos"
            name="reprocesos"
            checked={filtros.reprocesos}
            onChange={handleFiltroChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="reprocesos" className="ml-2 block text-sm text-gray-700">
            Reprocesos
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="bin"
            name="bin"
            checked={filtros.bin}
            onChange={handleFiltroChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="bin" className="ml-2 block text-sm text-gray-700">
            BIN
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="sinOrigen"
            name="sinOrigen"
            checked={filtros.sinOrigen}
            onChange={handleFiltroChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="sinOrigen" className="ml-2 block text-sm text-gray-700">
            Sin Origen
          </label>
        </div>
      </div>
    </form>
  );
};

FiltrosForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default FiltrosForm;