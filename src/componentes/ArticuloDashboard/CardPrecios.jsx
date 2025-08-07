import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CurrencyDollarIcon,
    ArrowsRightLeftIcon,
    CalendarIcon,
    ChartBarIcon
} from '@heroicons/react/20/solid'; // Cambiado a 20/solid para iconos más pequeños

const CardPrecios = ({ idArticulo }) => {
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!idArticulo) return;

        const fetchData = async () => {
            setCargando(true);
            try {
                const response = await axios.get(`http://10.0.0.19:5000/getPrecios?idarticulo=${idArticulo}`);
                console.log(response.data)
                setDatos(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        fetchData();
    }, [idArticulo]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value || 0);
    };

    const formatPercent = (value) => {
        return `${(value * 100).toFixed(2)}%`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (cargando) {
        return (
            <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xs mx-auto mt-2 bg-red-50 border-l-2 border-red-500 p-2 text-xs">
                <div className="flex items-center">
                    <svg className="h-4 w-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700">Error: {error}</span>
                </div>
            </div>
        );
    }

    if (!datos[0]) return null;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-3">
                <h2 className="text-sm font-medium text-gray-800 mb-2">Datos de Precios</h2>

                <div className="space-y-3">
                    {/* Coste Estandar */}
                    <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-xs text-gray-500 flex-1">Coste Estandar</span>
                        <span className="text-xs font-medium text-blue-600">
                            {formatCurrency(datos[0].PrecioEstandarA)}
                        </span>
                    </div>

                    {/* P. Venta */}
                    <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 text-purple-500 mr-2" />
                        <span className="text-xs text-gray-500 flex-1">P. Venta</span>
                        <span className="text-xs font-medium text-purple-600">
                            {formatCurrency(datos[0].PVPMinimo)}
                        </span>
                    </div>

                    {/* P.P */}
                    <div className="flex items-center">
                        <ChartBarIcon className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-xs text-gray-500 flex-1">P.P</span>
                        <span className="text-xs font-medium text-green-600">
                            {formatCurrency(datos[0]['PP'])}
                        </span>
                    </div>

                    {/* Margen */}
                    <div className="flex items-center">
                        <div className="h-4 w-4 mr-2"></div> {/* Espacio para icono si lo añades */}
                        <span className="text-xs text-gray-500 flex-1">Margen</span>
                        <span className="text-xs font-medium text-amber-600">
                            {formatPercent(datos[0].Margen)}
                        </span>
                    </div>

                    {/* Diferencia */}
                    <div className="flex items-center">
                        <ArrowsRightLeftIcon className={`h-4 w-4 mr-2 ${datos.Diferencia >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                        <span className="text-xs text-gray-500 flex-1">Diferencia</span>
                        <span className={`text-xs font-medium ${datos.Diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(datos[0].Diferencia)}
                        </span>
                    </div>

                    {/* Fecha Precio */}
                    <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-xs text-gray-500 flex-1">Fecha Precio</span>
                        <span className="text-xs font-medium text-gray-600">
                            {formatDate(datos[0].FechaEstandar)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardPrecios;