// src/components/ListadoDeCarga/DraggableHeader.jsx
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';

const DraggableHeader = ({ column, onColumnReorder }) => {
  const ref = React.useRef(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'COLUMN',
    item: { id: column.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'COLUMN',
    hover: (item) => {
      if (!ref.current || item.id === column.id) return;
      if (onColumnReorder) {
        onColumnReorder(item.id, column.id);
      }
      item.id = column.id;
    },
  });

  drag(drop(ref));

  return (
    <th 
      ref={ref}
      {...column.getHeaderProps()}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        width: column.width,
        minWidth: column.minWidth,
      }}
      className="px-3 py-3 text-left text-xs font-sans text-gray-500 uppercase tracking-wider hover:bg-gray-100"
    >
      <div className="flex items-center font-BlinkMacSystemFont">
        {column.render('Header')}
        {/* <span className="ml-1">↔</span> */}
      </div>
    </th>
  );
};

DraggableHeader.propTypes = {
  column: PropTypes.object.isRequired,
  onColumnReorder: PropTypes.func,
};

export default DraggableHeader;