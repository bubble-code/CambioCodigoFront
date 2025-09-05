import { useMemo, useState, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Menu, MenuButton, MenuItems, MenuItem, Portal } from '@headlessui/react';
import { ChevronUpDownIcon, FunnelIcon, ChevronUpIcon, ChevronDownIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatearNumero, formatearFechaES } from '../utils/cargaHelpers';
import { ErrorMessage, LoadingMessage, NoDataMessage } from '../utils/MensajesFetch';
import IconFecha from './IconFecha';
import "./style.css";

const ResultsTable = ({ data, loading, error }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = useMemo(() => [
    {
      header: 'Artículo',
      accessorKey: 'IDArticulo',
      cell: ({ getValue }) => getValue() || '-',
      size: 100,
      enableColumnFilter: true,
      filterFn: 'includesString',
    },
    {
      header: 'Descripción',
      accessorKey: 'DescArticulo',
      cell: ({ getValue }) => getValue() || '',
      size: 200,
      enableColumnFilter: true,
      filterFn: 'includesString',
    },
    {
      header: 'DescCliente',
      accessorKey: 'DescCliente',
      cell: ({ getValue }) => getValue() || '',
      size: 100,
      enableColumnFilter: true,
      filterFn: 'includesString',
    },
    {
      header: 'FechaReCliente',
      accessorKey: 'FechaReCliente',
      cell: ({ getValue, row }) => {
        const value = getValue();
        if (!value) return '';
        const fecha = moment.utc(value);
        const fechaRender = formatearFechaES(value);
        const hoy = moment().startOf('day');
        const fechaPropuesta = row.original.FechaPropuesta;
        const tieneAtraso = formatearFechaES(fechaPropuesta) < hoy;
        let classes = '';
        if (fecha.isBefore(hoy, 'day')) {
          classes = 'bg-red-100 text-blue-700 border border-red-300 px-2 py-1 rounded-full text-xs font-semibold';
        }
        return (
          <div className="flex flex-row items-end justify-end">
            {tieneAtraso || (
              <span className="mr-1 relative group">
                <IconFecha fechaPropuesta={fechaPropuesta} />
              </span>
            )}
            <span className={classes}>
              {fechaRender}
            </span>
          </div>
        );
      },
      size: 100,
    },
    {
      header: 'Nota L',
      accessorKey: 'NotaL',
      cell: ({ getValue }) => getValue() || '',
      size: 50,
    },
    {
      header: 'QPendiente',
      accessorKey: 'QPendiente',
      cell: ({ getValue, row }) => {
        const value = getValue();
        const estadoCero = row.original.Estado === 0;
        let classes = estadoCero ? 'bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded-full text-xs font-semibold' : '';
        return (
          <span className={classes}>
            {formatearNumero(value)}
          </span>
        );
      },
      size: 100,
    },
    {
      header: 'Stock',
      accessorKey: 'Existencias',
      cell: ({ getValue, row }) => {
        const value = getValue();
        const estado = row.original.Estado;
        let classes = '';
        switch (estado) {
          case 0:
          case 2:
            classes = 'bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded-full text-xs font-semibold';
            break;
          default:
            break;
        }
        return (
          <span className={classes}>
            {formatearNumero(value)}
          </span>
        );
      },
      size: 100,
    },
    {
      header: 'NPedido',
      accessorKey: 'NPedido',
      cell: ({ getValue }) => getValue() || '',
      size: 100,
      enableColumnFilter: true,
      filterFn: 'includesString',
    },
    {
      header: 'Linea',
      accessorKey: 'Linea',
      cell: ({ getValue }) => getValue() || '',
      size: 100,
    },
    {
      header: 'Precio',
      accessorKey: 'Precio',
      cell: ({ getValue }) => formatearNumero(getValue(), 2),
      size: 100,
    },
    {
      header: 'Total',
      accessorKey: 'Total',
      cell: ({ getValue }) => formatearNumero(getValue(), 2),
      size: 100,
    },
    {
      header: 'BIN',
      accessorKey: 'BIN',
      cell: ({ getValue, row }) => {
        const value = getValue();
        const estado = row.original.Estado;
        let classes = '';
        switch (estado) {
          case 2:
            classes = 'bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded-full text-xs font-semibold';
            break;
          default:
            break;
        }
        return (
          <span className={classes}>
            {formatearNumero(value) || ''}
          </span>
        );
      },
      size: 100,
    },
    {
      header: 'Disponible',
      accessorKey: 'Disponible',
      cell: ({ getValue }) => formatearNumero(getValue()),
      size: 100,
    },
    {
      header: 'FasesR',
      accessorKey: 'FaseR',
      cell: ({ getValue, row }) => {
        const value = getValue();
        if (!value) return '';
        const estado = row.original.Estado;
        let classes = '';
        let content = value;
        
        switch (estado) {
          case 0:
            classes = 'bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded-full text-xs font-semibold';
            break;
          case 1:
            classes = 'bg-red-100 text-red-700 border border-red-300 px-2 py-1 rounded-full text-xs font-semibold';
            break;
          case 2:
            const partes = value.split("->");
            content = (
              <>
                {partes[0]}
                <span className="bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded-full text-xs font-semibold">
                  {partes[1]?.trim()}
                </span>
              </>
            );
            break;
          default:
            break;
        }
        return (
          <span className={classes}>
            {content}
          </span>
        );
      },
      size: 100,
    },
    {
      header: 'OrdenFab',
      accessorKey: 'Ordenfabricacion',
      cell: ({ getValue }) => getValue() || '',
      size: 100,
      enableColumnFilter: true,
      filterFn: 'includesString',
    },
  ], []);

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 1500,
      },
    },
  });

  const handleSort = (columnId, direction) => {
    setSorting([{ id: columnId, desc: direction === 'desc' }]);
  };

  const clearSort = (columnId) => {
    setSorting(sorting.filter(sort => sort.id !== columnId));
  };

  const handleFilter = (columnId, value) => {
    setColumnFilters(prev => 
      prev.filter(filter => filter.id !== columnId).concat(
        value ? { id: columnId, value } : []
      )
    );
  };

  const clearFilter = (columnId) => {
    setColumnFilters(prev => prev.filter(filter => filter.id !== columnId));
  };

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage message={error} />;
  if (!data || data.length === 0) return <NoDataMessage />;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Barra de búsqueda global */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="global-search" className="sr-only">Buscar</label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="global-search"
                type="text"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Buscar en todos los campos..."
                className="block w-full rounded-md border-gray-300 pl-10 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
              />
              {globalFilter && (
                <button
                  onClick={() => setGlobalFilter('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <span className="text-gray-400 hover:text-gray-600">✕</span>
                </button>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {table.getFilteredRowModel().rows.length} de {data.length} registros
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const column = header.column;
                  const isSorted = column.getIsSorted();
                  const filterValue = columnFilters.find(f => f.id === column.id)?.value || '';
                  
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.column.columnDef.size }}
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center justify-between">
                        <span>{header.column.columnDef.header}</span>
                        
                        <div className="flex items-center gap-1">
                          {/* Indicador de ordenamiento */}
                          {isSorted && (
                            <span className="text-gray-400">
                              {isSorted === 'desc' ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
                            </span>
                          )}
                          
                          {/* Indicador de filtro */}
                          {filterValue && (
                            <span className="text-blue-500">
                              <FunnelIcon className="h-3 w-3" />
                            </span>
                          )}
                          
                          {/* Menú de opciones */}
                          <Menu as="div" className="relative">
                            <MenuButton className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                              <Cog6ToothIcon className="h-4 w-4" />
                            </MenuButton>
                            
                            {/* <Portal> */}
                              <MenuItems className="fixed z-50 mt-1 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                                <div className="px-4 py-2 text-xs text-gray-500 border-b bg-gray-50">
                                  {header.column.columnDef.header}
                                </div>
                                
                                {/* Opciones de ordenamiento */}
                                <MenuItem>
                                  <button
                                    onClick={() => handleSort(column.id, 'asc')}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                  >
                                    Ordenar A-Z
                                  </button>
                                </MenuItem>
                                <MenuItem>
                                  <button
                                    onClick={() => handleSort(column.id, 'desc')}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                  >
                                    Ordenar Z-A
                                  </button>
                                </MenuItem>
                                
                                {/* Opciones de filtro */}
                                {column.columnDef.enableColumnFilter && (
                                  <>
                                    <div className="border-t my-1" />
                                    <div className="px-3 py-2">
                                      <label className="block text-xs text-gray-500 mb-1">Filtrar:</label>
                                      <input
                                        type="text"
                                        value={filterValue}
                                        onChange={(e) => handleFilter(column.id, e.target.value)}
                                        placeholder={`Filtrar ${header.column.columnDef.header}...`}
                                        className="block w-full rounded-md border-gray-300 text-sm px-2 py-1 focus:border-blue-500 focus:ring-blue-500"
                                      />
                                      {filterValue && (
                                        <button
                                          onClick={() => clearFilter(column.id)}
                                          className="mt-1 text-xs text-red-600 hover:text-red-800"
                                        >
                                          Limpiar filtro
                                        </button>
                                      )}
                                    </div>
                                  </>
                                )}
                                
                                {/* Limpiar ordenamiento */}
                                {isSorted && (
                                  <MenuItem>
                                    <button
                                      onClick={() => clearSort(column.id)}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 border-t"
                                    >
                                      Limpiar orden
                                    </button>
                                  </MenuItem>
                                )}
                              </MenuItems>
                            {/* </Portal> */}
                          </Menu>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.columnDef.size }}
                    className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 font-sans"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Mostrando{' '}
              <span className="font-medium">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </span>{' '}
              a{' '}
              <span className="font-medium">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </span>{' '}
              de{' '}
              <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>{' '}
              resultados
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <span className="text-sm text-gray-700">
                Página{' '}
                <strong>
                  {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </strong>
              </span>
              
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
              
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                {[30, 100, 500, 1000, 1050].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Mostrar {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ResultsTable.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default ResultsTable;