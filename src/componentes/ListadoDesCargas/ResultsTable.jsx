import { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table'; // Añadido usePagination
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableHeader from './DraggableHeader';
import PropTypes, { bool } from 'prop-types';
import moment from 'moment';


const ResultsTable = ({ data, loading, error }) => {
  const [columnOrder, setColumnOrder] = useState([]);


  const formatearNumero = (value, decimales = 0) => {
    if (value === null || value === "") return "";
    const numero = parseFloat(String(value).replace(",", "."));
    if (isNaN(numero) || numero === 0) return ""
    return numero.toFixed(decimales).replace(".", ",");
  }

  const formatearFechaES = (fechaGMT) => {
    if (!fechaGMT) return '';

    try {
      // Parseamos como UTC explícitamente
      const fecha = moment.utc(fechaGMT);

      if (!fecha.isValid()) {
        // Si falla, intentamos con el formato de la base de datos
        const fechaAlt = moment.utc(fechaGMT, 'YYYY-MM-DD HH:mm:ss.SSS', true);
        return fechaAlt.isValid() ? fechaAlt.format('DD/MM/YYYY') : fechaGMT;
      }

      return fecha.format('DD/MM/YYYY');
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return fechaGMT;
    }
  }

  const columns = useMemo(() => [
    {
      Header: 'Artículo',
      accessor: 'IDArticulo',
      Cell: ({ value }) => value || '-',
      width: 100,
    },
    {
      Header: 'Descripción',
      accessor: 'DescArticulo',
      Cell: ({ value }) => value || '',
      width: 200,
    },
    {
      Header: 'DescCliente',
      accessor: 'DescCliente',
      Cell: ({ value }) => value || '',
      width: 100,
    },
    {
      Header: 'FechaReCliente',
      accessor: 'FechaReCliente',
      Cell: ({ value, row }) => {
        if (!value) return '';
        const fecha = moment.utc(value);
        const fechaRender = formatearFechaES(value)
        const hoy = moment().startOf('day');
        const estadoCero = row.original.Estado === 0;
        let classes = ''
        if (estadoCero) {
          classes = 'bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded-full text-xs font-semibold';
        }
        else if (fecha.isBefore(hoy, 'day')) {
          classes = 'bg-red-100 text-red-700 border border-red-300 px-2 py-1 rounded-full text-xs font-semibold';
        }

        return (
          <span className={classes}>
            {fechaRender}
          </span>)
      },
      width: 100,
    },
    {
      Header: 'Nota L',
      accessor: 'NotaL',
      Cell: ({ value }) => value || '',
      width: 50,
      maxWidth: 50
    },
    {
      Header: 'QPendiente',
      accessor: 'QPendiente',
      Cell: ({ value, row }) => {
        const estadoCero = row.original.Estado === 0
        let classes = estadoCero ? 'bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded-full text-xs font-semibold' : '';
        return (
          <span className={classes}>
            {formatearNumero(value)}
          </span>
        );
      },
      width: 100,
    },
    {
      Header: 'Stock',
      accessor: 'Existencias',
      Cell: ({ value, row }) => {
        const estadoCero = row.original.Estado === 0
        let classes = estadoCero ? 'bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded-full text-xs font-semibold' : '';
        return (
          <span className={classes}>
            {formatearNumero(value)}
          </span>
        );
      },
      width: 100,
    },
    {
      Header: 'NPedido',
      accessor: 'NPedido',
      Cell: ({ value }) => value || '',
      width: 100,
    },
    {
      Header: 'Linea',
      accessor: 'Linea',
      Cell: ({ value }) => value || '',
      width: 100,
    },
    {
      Header: 'Precio',
      accessor: 'Precio',
      Cell: ({ value }) => formatearNumero(value, 2),
      width: 100,
    },
    {
      Header: 'Total',
      accessor: 'Total',
      Cell: ({ value }) => formatearNumero(value, 2),
      width: 100,
    },
    {
      Header: 'BIN',
      accessor: 'BIN',
      Cell: ({ value }) => formatearNumero(value),
      width: 100,
    },
    {
      Header: 'Disponible',
      accessor: 'Disponible',
      Cell: ({ value }) => formatearNumero(value),
      width: 100,
    },
    {
      Header: 'FasesR',
      accessor: 'FaseR',
      Cell: ({ value, row }) => {
        if (!value) return '';
        const estadoCero = row.original.Estado === 0;
        const classes = estadoCero
          ? 'bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded-full text-xs font-semibold'
          : '';
        return (
          <span className={classes}>
            {value || ''}
          </span>
        );
      },
      width: 100,
    },
    {
      Header: 'OrdenFab',
      accessor: 'Ordenfabricacion',
      Cell: ({ value }) => value || '',
      width: 100,
    },
  ], []);

  useEffect(() => {
    if (columns.length > 0 && columnOrder.length === 0) {
      const defaultOrder = columns.map(col => col.accessor);
      setColumnOrder(defaultOrder);
    }
  }, [columns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Usamos page en lugar de rows por la paginación
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
    setColumnOrder: setTableColumnOrder
  } = useTable(
    {
      columns,
      data: data || [],
      initialState: {
        pageIndex: 0,
        pageSize: 18,
        columnOrder: columnOrder.length ? columnOrder : columns.map(col => col.accessor)
      },
      autoResetPage: false,
    },
    usePagination
  );



  const handleColumnReorder = (draggedId, targetId) => {
    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedId);
    const targetIndex = newOrder.indexOf(targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedId);

    setColumnOrder(newOrder);
    setTableColumnOrder(newOrder);
  };

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage message={error} />;
  if (!data || data.length === 0) return <NoDataMessage />;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <DraggableHeader
                    key={column.id}
                    column={column}
                    onColumnReorder={handleColumnReorder}
                  />
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map(row => { // Cambiado de rows a page
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50">
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 font-sans text-so-gray bg-so-bg"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Controles de paginación */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${!canPreviousPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Anterior
            </button>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${!canNextPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{pageIndex * pageSize + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min((pageIndex + 1) * pageSize, data.length)}
                </span>{' '}
                de <span className="font-medium">{data.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${!canPreviousPage ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  <span className="sr-only">Primera</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M8.707 5.293a1 1 0 010 1.414L5.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${!canPreviousPage ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  <span className="sr-only">Anterior</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Página {pageIndex + 1} de {pageOptions.length}
                </span>
                <button
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${!canNextPage ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  <span className="sr-only">Siguiente</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${!canNextPage ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  <span className="sr-only">Última</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M11.293 14.707a1 1 0 010-1.414L14.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
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

ResultsTable.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default ResultsTable;
