import { useState, useMemo } from 'react';
import moment from 'moment';
import { ErrorMessage, LoadingMessage, NoDataMessage } from '../../utils/MensajesFetch';
import { formatearNumero, formatearFechaES } from '../../utils/cargaHelpers';
import { useCentros } from '../../Hooks/useCentros';
import { useCargaByCentros } from '../../Hooks/useCargaByCentros';
import CentrosMenu from './CentrosMenu';
import CargaTabla from './CargaTabla';

const CargaCalendario = ({ listaOfs }) => {
    const { centros, loading, error } = useCentros()
    const [selectedCentro, setSelectedCentro] = useState(null);

    const { data, loading: loadingData, error: errorData } = useCargaByCentros(
        selectedCentro?.id,
        listaOfs
    );

    const columns = useMemo(() => [
        { Header: 'Artículo', accessor: 'IDArticulo', Cell: ({ value }) => value || '' },
        { Header: 'DescArticulo', accessor: 'DescArticulo', Cell: ({ value }) => value || '' },
        { Header: 'Cliente', accessor: 'DescCliente', Cell: ({ value }) => value || '' },
        {
            Header: 'FechaReSeccion',
            accessor: 'FechaReSeccion', Cell: ({ value, row }) => {
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
        },
        { Header: 'NotaL', accessor: 'NotaL', Cell: ({ value }) => value || '' },
        { Header: 'QPendiente', accessor: 'QPendiente', Cell: ({ value }) => formatearNumero(value) },
        { Header: 'Stock', accessor: 'Existencias', Cell: ({ value }) => formatearNumero(value) },
        { Header: 'BIN', accessor: 'BIN', Cell: ({ value }) => formatearNumero(value) },
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
            }
        },
        {
            Header: 'FechaReCliente',
            accessor: 'FechaReCliente', Cell: ({ value, row }) => {
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
        },
        {
            Header: 'OrdenFab',
            accessor: 'Ordenfabricacion',
            Cell: ({ value }) => value || '',
        },
        {
            Header: 'QFabricar',
            accessor: 'QFabricar',
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
            Header: 'Tiempo Previsto',
            accessor: 'TPrevisto',
            Cell: ({ value }) => value || '',
        },
    ], []);

    if (loading) return <LoadingMessage />;
    if (error) return <ErrorMessage message={error} />;
    if (!centros.length) return <NoDataMessage />;

    return (
        <div className="flex h-full">
            <CentrosMenu
                centros={centros}
                selectedCentro={selectedCentro}
                onSelect={setSelectedCentro}
            />
            <CargaTabla
                columns={columns}
                data={selectedCentro?.datos || []}
            />
        </div>
    );
};

export default CargaCalendario;
