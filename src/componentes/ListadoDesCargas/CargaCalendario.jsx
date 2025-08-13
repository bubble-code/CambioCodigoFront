import { useEffect, useState } from 'react';
import { formatearFechaES } from '../utils/cargaHelpers'
import { CargaService } from '../../services/apiService';

const CargaCalendario = ({ data, loading, error }) => {
    const [centros, setCentros] = useState([]);

    useEffect(() => {
        const fetchCentros = async () => {
            try {
                const dataCentros = await CargaService.getCentros();
                setCentros(dataCentros)
            } catch (error) {
                console.log("Error al obtener los centros:", centros);
            }
        };
        fetchCentros();
    }, [])


    const getColorPorCarga = (carga) => {
        if (carga === 0) return 'bg-transparent';
        if (carga < 30) return 'bg-green-300';
        if (carga < 70) return 'bg-yellow-300';
        return 'bg-red-400';
    };


    const generarFechasHorizontales = (dias = 14) => {
        const hoy = new Date();
        const fechas = [];
        for (let i = 0; i < dias; i++) {
            const fecha = new Date(hoy);
            fecha.setDate(hoy.getDate() + i);
            fechas.push(fecha);
        }
        return fechas;
    };

    const fechas = generarFechasHorizontales(); // función que genera los días visibles
    if (loading) return <LoadingMessage />;
    if (error) return <ErrorMessage message={error} />;
    if (!data || data.length === 0) return <NoDataMessage />;
    return (
        <div className="overflow-auto border rounded-lg mt-4">
            <table className="min-w-full table-fixed border-collapse">
                <thead>
                    <tr>
                        <th className="w-40 bg-gray-100 border p-2 text-left">Centro</th>
                        {fechas.map((fecha, idx) => (
                            <th key={idx} className="w-24 bg-gray-100 border p-2 text-center">
                                {formatearFechaES(fecha)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {centros.map(({ DescSeccion, IDSeccion }, idx) => (
                        <tr key={idx}>
                            <td className="border p-2 font-semibold bg-gray-50"><div><span>{IDSeccion}</span></div><span>{DescSeccion}</span></td>
                            {fechas.map((fecha, fIdx) => {
                                // const carga = calcularCarga(data, centro, fecha);
                                const carga = 30;
                                return (
                                    <td key={fIdx} className="border p-2 text-center bg-white">
                                        <div
                                            className={`h-4 rounded ${getColorPorCarga(carga)}`}
                                            title={`Carga: ${carga}`}
                                        >
                                            {carga > 0 ? carga : ''}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const LoadingMessage = () => (
    <div className="p-4 text-center">
        <div className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando datos...
        </div>
    </div>
);

const ErrorMessage = ({ message }) => (
    <div className="p-4 text-center bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 font-medium">Error al cargar los datos</p>
        <p className="text-red-500 text-sm mt-1">{message}</p>
    </div>
);

const NoDataMessage = () => (
    <div className="p-4 text-center bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-600">No hay datos disponibles</p>
        <p className="text-blue-500 text-sm mt-1">Realiza una búsqueda para ver los resultados</p>
    </div>
);

export default CargaCalendario;
