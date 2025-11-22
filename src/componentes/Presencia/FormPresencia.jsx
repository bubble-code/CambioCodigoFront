import { useState } from 'react';
import axios from 'axios';
import { sub } from 'date-fns';
import { CargaService } from '../../services/apiService';

const FormPresencia = () => {
    const [idOperario, setIdOperario] = useState('');
    const [fechaDesde, setFechaDesde] = useState(new Date().toISOString().split('T')[0]);
    const [fechaHasta, setFechaHasta] = useState(new Date().toISOString().split('T')[0]);
    const [resultados, setResultados] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    // Función para formatear fechas
    const formatFecha = (fechaString) => {
        if (!fechaString) return '-';

        try {
            const fechaObj = new Date(fechaString);
            if (isNaN(fechaObj.getTime())) return '-';

            // Formato: dd/mm/aaaa hh:mm
            const dia = fechaObj.getDate().toString().padStart(2, '0');
            const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
            const año = fechaObj.getFullYear();
            const horasMenos = fechaObj.getHours() - 0 ;
            const horas = horasMenos.toString().padStart(2, '0');
            const minutos = fechaObj.getMinutes().toString().padStart(2, '0');

            return `${dia}/${mes}/${año} ${horas}:${minutos}`;
        } catch {
            return '-';
        }
    };

    // Función para formatear solo hora (hh:mm)
    const formatHora = (horaString) => {
        if (!horaString) return '-';

        try {
            const horaObj = new Date(`1970-01-01T${horaString}`);
            if (isNaN(horaObj.getTime())) return '-';

            const horas = horaObj.getHours().toString().padStart(2, '0');
            const minutos = horaObj.getMinutes().toString().padStart(2, '0');

            return `${horas}:${minutos}`;
        } catch {
            return '-';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError(null);

        try {
            // const response = await axios.post('http://10.0.0.19:5000/getFichajes', {
            //     idoperario: idOperario,
            //     fechaDesde: fechaDesde,
            //     fechaHasta: fechaHasta
            // });
            const response = await CargaService.GetFichajes(fechaDesde,fechaHasta,idOperario)

            setResultados(response.data);
            console.log(response.data)
        } catch (err) {
            setError(err.response?.data?.message || 'Error al obtener los fichajes');
            console.error('Error:', err);
        } finally {
            setCargando(false);
        }
    };

    const formatOperarioId = (id) => {
        if (!id) return '';
        return id.replace('FV', '').padStart(3, '0');
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Revisión de Presencia</h1>

            {/* Formulario de búsqueda */}
            <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
                <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-4">
                    <div>
                        <label htmlFor="idOperario" className="block text-sm font-medium text-gray-700 mb-1">
                            ID Operario (Ej: FV10)
                        </label>
                        <input
                            type="text"
                            id="idOperario"
                            value={idOperario}
                            onChange={(e) => setIdOperario(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Ej: FV10"
                            // required
                            pattern="FV\d+"
                            title="El ID debe comenzar con FV seguido de números"
                        />
                    </div>

                    <div>
                        <label htmlFor="fechaDesde" className="block text-sm font-medium text-gray-700 mb-1">
                            FechaDesde
                        </label>
                        <input
                            type="date"
                            id="fecha"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                            FechaHasta
                        </label>
                        <input
                            type="date"
                            id="fecha"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={cargando}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {cargando ? 'Buscando...' : 'Buscar Fichajes'}
                </button>
            </form>

            {/* Mensajes de error */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Resultados - Tres tablas en línea */}
            {resultados && (
                <div className="flex flex-col md:flex-row gap-4 overflow-x-auto">
                    {/* Tabla Solmicro */}
                    <div className="flex-1 min-w-[300px] bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Solmicro</h2>
                        {resultados.Solmicro.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-3 py-2 text-left">Operario</th>
                                            <th className="px-3 py-2 text-left">Hora</th>
                                            <th className="px-3 py-2 text-left">Entrada</th>
                                            <th className="px-3 py-2 text-left">MotivoAusencia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultados.Solmicro.map((item, index) => (
                                            <tr key={`solmicro-${index}`} className="border-t border-gray-200">
                                                <td className="px-3 py-2">{formatOperarioId(item.IDOperario)}</td>
                                                <td className="px-3 py-2">{formatFecha(item.Hora)}</td>
                                                <td className="px-3 py-2">{item.Entrada ? '✅' : '❌'}</td>
                                                <td className="px-3 py-2">{item.MotivoAusencia}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No hay registros en Solmicro</p>
                        )}
                    </div>

                    {/* Tabla Industry */}
                    <div className="flex-1 min-w-[300px] bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Industry</h2>
                        {resultados.Industry.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-3 py-2 text-left">Operario</th>
                                            <th className="px-3 py-2 text-left">Entrada</th>
                                            <th className="px-3 py-2 text-left">Salida</th>
                                            <th className="px-3 py-2 text-left">Incidencia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultados.Industry.map((item, index) => (
                                            <tr key={`industry-${index}`} className="border-t border-gray-200">
                                                <td className="px-3 py-2">{formatOperarioId(item.Operario)}</td>
                                                <td className="px-3 py-2">{formatFecha(item.HoraEntrada) || '-'}</td>
                                                <td className="px-3 py-2">{formatFecha(item.HoraSalida) || '-'}</td>
                                                <td className="px-3 py-2">{item.Incidencia || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No hay registros en Industry</p>
                        )}
                    </div>

                    {/* Tabla Backup */}
                    <div className="flex-1 min-w-[300px] bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Backup</h2>
                        {resultados.Backup.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-3 py-2 text-left">Operario</th>
                                            <th className="px-3 py-2 text-left">Entrada</th>
                                            <th className="px-3 py-2 text-left">Salida</th>
                                            <th className="px-3 py-2 text-left">Incidencia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultados.Backup.map((item, index) => (
                                            <tr key={`backup-${index}`} className="border-t border-gray-200">
                                                <td className="px-3 py-2">{formatOperarioId(item.Operario)}</td>
                                                <td className="px-3 py-2">{formatFecha(item.HoraEntrada) || '-'}</td>
                                                <td className="px-3 py-2">{formatFecha(item.HoraSalida) || '-'}</td>
                                                <td className="px-3 py-2">{item.Incidencia || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No hay registros en Backup</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FormPresencia;