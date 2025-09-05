import { formatearFechaES } from "../utils/cargaHelpers";

const IconFecha = ({ fechaPropuesta }) => {
  return (
    <div className="relative group inline-block">
      {/* Ícono de advertencia */}
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

      {/* Tooltip */}
      <div className="absolute invisible group-hover:visible z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2  bg-gray-800 text-white text-xl rounded-md p-2 shadow-lg">
        <div className="font-semibold">Retraso en entrega</div>
        <div>Fecha propuesta: {formatearFechaES(fechaPropuesta)}</div>
        <div className="mt-1">
          La cantidad de operaciones es mayor que el tiempo disponible para la entrega.
        </div>
        {/* Flechita del tooltip */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-8 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

export default IconFecha;
