import { useTable } from 'react-table';

const CargaTabla = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data });

    return (
        <div className="overflow-x-auto flex-1">
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
        </div>
    );
};

export default CargaTabla;
