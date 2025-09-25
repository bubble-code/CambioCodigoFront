import { useRef,useState } from 'react';
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react';
import { formatearFechaES } from "../utils/cargaHelpers";
import "./style.css";

const IconFecha = ({ fechaPropuesta }) => {
  const iconRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    placement: 'top',
    middleware: [
      offset(10),
      flip(),
      shift({ padding: 10 })
    ],
  });

  return (
    <>
      {/* Ícono de advertencia */}
      <div
        ref={refs.setReference}
        className="relative inline-block"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="yellow"
          viewBox="0 0 24 24"
          stroke="red"
          className="h-4 w-4 cursor-help"
        >
          <path
            fillRule="evenodd"
            d="M10.29 3.86a1.5 1.5 0 012.42 0l8.26 13.5A1.5 1.5 0 0119.76 19H4.24a1.5 1.5 0 01-1.21-2.64l8.26-13.5zM12 9v4m0 4h.01"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Tooltip */}
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-[9999] bg-gray-800 text-white text-sm rounded-md p-3 shadow-xl max-w-xl"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="font-semibold mb-1">Retraso en entrega</div>
          <div className="mb-1">Fecha propuesta: {formatearFechaES(fechaPropuesta)}</div>
          <div className="text-gray-300">
            La cantidad de operaciones es mayor que el tiempo disponible para la entrega.
          </div>
        </div>
      )}
    </>
  );
};

export default IconFecha;