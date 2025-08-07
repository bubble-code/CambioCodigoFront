import React, { useState, useEffect, useMemo,useCallback  } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const TablaDetallesArticulo = ({ idArticulo, endpoint, titulo, tablaId }) => {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [columnOrder, setColumnOrder] = useState([]);

  // Obtener datos
  useEffect(() => {
    if (!idArticulo) {
      setDatos([]);
      return;
    }

    const fetchData = async () => {
      setCargando(true);
      try {
        const response = await axios.get(`${endpoint}?idarticulo=${idArticulo}`);
        setDatos(response.data);
      } catch (error) {
        console.error(`Error al obtener datos de ${titulo}:`, error);
        setDatos([]);
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, [idArticulo, endpoint]);

  // Definir orden de columnas
  useEffect(() => {
    if (datos.length > 0) {
      const savedOrder = localStorage.getItem(`columnOrder-${tablaId}`);
      const allColumns = Object.keys(datos[0]);
      
      if (savedOrder) {
        try {
          const parsedOrder = JSON.parse(savedOrder);
          // Filtramos solo las columnas que existen actualmente
          const validOrder = parsedOrder.filter(col => allColumns.includes(col));
          // Si el orden guardado es válido, lo usamos, si no, usamos el predeterminado
          setColumnOrder(validOrder.length > 0 ? validOrder : getDefaultOrder(allColumns));
        } catch (e) {
          setColumnOrder(getDefaultOrder(allColumns));
        }
      } else {
        setColumnOrder(getDefaultOrder(allColumns));
      }
    }
  }, [datos, tablaId]);

  // Función para obtener el orden predeterminado (IDArticulo primero)
  const getDefaultOrder = useCallback((columns) => {
    const priorityColumns = [
      'IDArticulo', 
      'Padre',
      'Codigo',
      'Descripcion'
    ];
    // 2. Filtrar solo las columnas prioritarias que existan en los datos
    const existingPriorityColumns = priorityColumns.filter(col => columns.includes(col));
    // 3. Obtener las columnas restantes (no prioritarias) en su orden original
    const remainingColumns = columns.filter(col => !priorityColumns.includes(col));
    return [...existingPriorityColumns, ...remainingColumns];
  }, []);


  // Definir columnas con id y accessor correctos
  const columns = useMemo(() => {
    return columnOrder.map(key => ({
      id: key, // ID único basado en el nombre de la columna
      Header: key,
      accessor: (row) => row[key], // Accessor como función para mayor seguridad
      Cell: ({ value }) => {
        const columnasFormatear = ["Cantidad", "Factor", "QFabricar", "LoteMinimo", 
                                "QFabricada", "StockFisico", "StockSeguridad", 
                                "Precio", "QPedida", "QServida"];
        
        if (columnasFormatear.includes(key)) {
          if (value === null || value === "") return "";
          const numero = parseFloat(String(value).replace(",", "."));
          return isNaN(numero) ? "" : numero.toFixed(2).replace(".", ",");
        }
        return value;
      }
    }));
  }, [columnOrder]);

  // Configurar tabla
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setColumnOrder: setTableColumnOrder,
  } = useTable({
    columns,
    data: datos,
    initialState: {
      columnOrder: columnOrder
    }
  });

  // Manejar el arrastre de columnas
  const moveColumn = (draggedColumnId, targetColumnId) => {
    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumnId);
    const targetIndex = newOrder.indexOf(targetColumnId);
    
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumnId);
    
    setColumnOrder(newOrder);
    setTableColumnOrder(newOrder);
    localStorage.setItem(`columnOrder-${tablaId}`, JSON.stringify(newOrder));
  };

  // Componente para cabeceras arrastrables
  const DraggableHeader = ({ column }) => {
    const ref = React.useRef(null);
    
    const [, drag] = useDrag({
      type: 'COLUMN',
      item: { id: column.id },
    });

    const [, drop] = useDrop({
      accept: 'COLUMN',
      hover: (item) => {
        if (item.id === column.id) return;
        moveColumn(item.id, column.id);
        item.id = column.id;
      },
    });

    drag(drop(ref));

    return (
      <th 
        ref={ref} 
        {...column.getHeaderProps()}
        className="cursor-move p-2 border-b capitalize text-left hover:bg-gray-100"
      >
        {column.render('Header')}
      </th>
    );
  };

  return (
    <div className="text-sm font-light text-gray-700">
      <h3 className="font-semibold mb-2">{titulo}</h3>
      
      {cargando ? (
        <div className="text-center py-4">
          <span className="animate-spin inline-block w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></span>
        </div>
      ) : datos.length === 0 ? (
        <p className="text-gray-500">No hay datos disponibles.</p>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className="overflow-x-auto max-h-[300px] min-h-[150px]">
            <table className="min-w-full border border-gray-200 text-xs">
              <thead className="bg-gray-50 text-gray-800 text-xs font-semibold uppercase tracking-wide">
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <DraggableHeader key={column.id} column={column} />
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="hover:bg-gray-50">
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} className="p-2 border-b text-gray-900">
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
      )}
    </div>
  );
};

export default TablaDetallesArticulo;