
export const LoadingMessage = () => (
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

export const ErrorMessage = ({ message }) => (
    <div className="p-4 text-center bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 font-medium">Error al cargar los datos</p>
        <p className="text-red-500 text-sm mt-1">{message}</p>
    </div>
);

export const NoDataMessage = () => (
    <div className="p-4 text-center bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-600">No hay datos disponibles</p>
        <p className="text-blue-500 text-sm mt-1">Realiza una búsqueda para ver los resultados</p>
    </div>
);