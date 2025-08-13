import { useEffect, useMemo, useState } from 'react';
import { formatearFechaES } from '../utils/cargaHelpers'
import { CargaService } from '../../services/apiService';
import { useTable } from 'react-table';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { formatearNumero } from '../utils/cargaHelpers'
import { LoadingMessage, ErrorMessage, NoDataMessage } from '../utils/MensajesFetch'

const CargaCentros = ({ fechaDesde, fechaHasta }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const dataCargas = await CargaService.getCargaPorCentros(fechaDesde, fechaHasta);
                setData(dataCargas);
            } catch (err) {
                console.error("Error al obtener la carga de los centros", err);
                setError("No se pudo cargar la información");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [fechaDesde, fechaHasta]);

    const columns = useMemo(() => [
        {
            Header: 'Selección',
            accessor: 'Seleccion',
            Cell: ({ value }) => value || '-',
            width: 100,
        },
        {
            Header: 'Centro',
            accessor: 'IDSeccion',
            Cell: ({ value }) => value || '-',
            width: 100,
        },
        {
            Header: 'Capacidad Teorica Diaria',
            accessor: 'CapacidadTeoricaDiaria',
            Cell: ({ value }) => formatearNumero(value),
            width: 100,
        },
        {
            Header: 'Seccion',
            accessor: 'DescSeccion',
            Cell: ({ value }) => value,
            width: 100,
        },
        {
            Header: 'Carga Trabajo',
            accessor: 'CargaTrabajo',
            Cell: ({ value }) => value,
            width: 100,
        },
        {
            Header: '%',
            accessor: 'Porcentaje',
            Cell: ({ value }) => value,
            width: 100,
        },
        {
            Header: 'Total % Secciones',
            accessor: 'TotalPorcentaje',
            Cell: ({ value }) => value,
            width: 100,
        },
        {
            Header: 'Cant Trabajos',
            accessor: 'QTrabajos',
            Cell: ({ value }) => value,
            width: 100,
        },
        {
            Header: 'Dias',
            accessor: 'Dias',
            Cell: ({ value }) => value,
            width: 100,
        },
        {
            Header: 'Carga Total',
            accessor: 'CargaTotal',
            Cell: ({ value }) => value,
            width: 100,
        },
        {
            Header: 'Carga Dias',
            accessor: 'CargaDias',
            Cell: ({ value }) => value,
            width: 100,
        },
        {
            Header: 'Carga Inmediata',
            accessor: 'CargaInmediata',
            Cell: ({ value }) => value,
            width: 100,
        },
        {
            Header: 'Carga Inmediata Dias',
            accessor: 'CargaInmediataDias',
            Cell: ({ value }) => value,
            width: 100,
        },
        {
            Header: 'Capacidad',
            accessor: 'Capacidad',
            Cell: ({ value }) => value,
            width: 100,
        },
    ], [])

    const tableInstance = useTable({ columns, data });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    if (loading) return <LoadingMessage />;
    if (error) return <ErrorMessage message={error} />;
    if (!data || data.length === 0) return <NoDataMessage />;

    return (<div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps()}
                                key={column.id}
                                className="px-3 py-2 border border-gray-300 text-left"
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} key={row.id} className="hover:bg-gray-50">
                            {row.cells.map(cell => (
                                <td
                                    {...cell.getCellProps()}
                                    key={cell.column.id}
                                    className="px-3 py-2 border border-gray-300"
                                >
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>)
}

export default CargaCentros