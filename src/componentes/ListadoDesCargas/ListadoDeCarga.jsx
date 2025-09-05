import { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import ResultsTable from './ResultsTable';
import FiltrosForm from './FiltrosForm';
import { CargaService } from '../../services/apiService';
import CargaCentros from './CargaCentros';
import CargaPorCentro from './DetallesCargaCentros/DetallesCargaCentros'; 

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ListadoDeCarga = () => {
  const [resultados, setResultados] = useState(null);
  const [listOfs, setListOfs] = useState(new Set());
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    idSeccion: "",
    fechaDesde: null,
    fechaHasta: null,
    filtros: null,
  })

  const handleSubmit = async (filtros) => {
    setCargando(true);
    setError(null);
    setResultados(null);
    setFiltros(filtros)

    try {
      const data = await CargaService.getListadoCarga(filtros);
      setResultados(data);
      // console.log(data)
      const ofs = new Set()
      data.forEach(element => {
        if (element['Ordenfabricacion'] != null )
          ofs.add(element['Ordenfabricacion'])
      });
      // console.log(ofs)
      setListOfs(ofs)
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
          <TabGroup>
            <TabList className="flex space-x-4 border-b border-gray-200">
              {['Pedidos', 'CargaCentros', 'Carga por centros', 'Otro componente'].map((tab, idx) => (
                <Tab
                  key={idx}
                  className={({ selected }) =>
                    classNames(
                      'py-2 px-4 text-sm font-medium focus:outline-none',
                      selected
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-600 hover:text-blue-500'
                    )
                  }
                >
                  {tab}
                </Tab>
              ))}
            </TabList>

            <TabPanels className="mt-4">
              <TabPanel>
                <ResultsTable
                  data={resultados}
                  loading={cargando}
                  error={error}
                />
              </TabPanel>
              <TabPanel>
                <CargaCentros
                  fechaDesde={filtros.fechaDesde}
                  fechaHasta={filtros.fechaHasta}
                  listaOfs={listOfs}
                />
              </TabPanel>
              <TabPanel>
                <CargaPorCentro
                  fechaDesde={filtros.fechaDesde}
                  fechaHasta={filtros.fechaHasta}
                  listaOfs={listOfs}
                />
              </TabPanel>
              <TabPanel>
                <div className="p-4 bg-gray-50 rounded">
                  Aquí iría tu otro componente o contenido.
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  );
};

export default ListadoDeCarga;