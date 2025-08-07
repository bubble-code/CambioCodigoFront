import { useMemo, useState } from 'react';
import { useTable } from 'react-table';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableHeader from './DraggableHeader';
import PropTypes from 'prop-types';

const ResultsTable = ({ data, loading, error }) => {
  const [columnOrder, setColumnOrder] = useState([]);

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
      Cell: ({ value }) => value || '-',
      width: 200,
    },
    {
      Header: 'Familia',
      accessor: 'Familia',
      Cell: ({ value }) => value || '-',
      width: 120,
    },
    {
      Header: 'Cliente',
      accessor: 'IDCliente',
      Cell: ({ value }) => value || '-',
      width: 100,
    },
    {
      Header: 'N° Pedido',
      accessor: 'NPedido',
      Cell: ({ value }) => value || '-',
      width: 100,
    },
    {
      Header: 'Nota L',
      accessor: 'NotaL',
      Cell: ({ value }) => value || '-',
      width: 100,
    },
    {
      Header: 'Q.Pedida',
      accessor: 'QPedida',
      Cell: ({ value }) => (value ? Number(value).toLocaleString() : '-'),
      width: 100,
    },
    {
      Header: 'Q.Servida',
      accessor: 'QServida',
      Cell: ({ value }) => (value ? Number(value).toLocaleString() : '-'),
      width: 100,
    },
    {
      Header: 'Q.Pendiente',
      accessor: 'QPendiente',
      Cell: ({ value }) => (value ? Number(value).toLocaleString() : '-'),
      width: 100,
    },
    {
      Header: 'Precio',
      accessor: 'Precio',
      Cell: ({ value }) => (value ? `$${Number(value).toLocaleString()}` : '-'),
      width: 100,
    },
    {
      Header: 'Stock',
      accessor: 'Stock',
      Cell: ({ value }) => (value ? Number(value).toLocaleString() : '-'),
      width: 100,
    },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setColumnOrder: setTableColumnOrder,
  } = useTable({
    columns,
    data: data || [],
    initialState: {
      columnOrder: columnOrder.length ? columnOrder : columns.map(col => col.accessor),
    },
  });

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
            {rows.map(row => {
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