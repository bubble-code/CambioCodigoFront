import { useState } from 'react';
import ResultsTable from './ResultsTable';
import FiltrosForm from './FiltrosForm';
import { CargaService } from '../../services/apiService';
import CargaCalendario from './CargaCalendario';

const ListadoDeCarga = () => {
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (filtros) => {
    setCargando(true);
    setError(null);
    setResultados(null);

    try {
      const data = await CargaService.getListadoCarga(filtros);
      setResultados(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener datos:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleReset = () => {
    setResultados(null);
    setError(null);
  };

  return (
    <div className="w-full px-4 py-4 mr-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Listado de Carga</h1>
        
        <FiltrosForm
          onSubmit={handleSubmit}
          onReset={handleReset}
          loading={cargando}
        />
        
        <div className="mt-6">
          <ResultsTable
            data={resultados}
            loading={cargando}
            error={error}
          />
        </div>
        <div className="mt-6">
          <CargaCalendario
          data={resultados}
          loading={cargando}
          error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default ListadoDeCarga;