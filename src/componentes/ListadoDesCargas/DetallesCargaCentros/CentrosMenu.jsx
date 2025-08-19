const CentrosMenu = ({ centros, onSelect, selectedCentro }) => {
    return (
        <div className="w-48 border-r border-gray-300">
            {centros.map(centro => (
                <button
                    key={centro.IDSeccion}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-200 ${selectedCentro?.IDSeccion === centro.IDSeccion ? "bg-gray-300 font-bold" : ""
                        }`}
                    onClick={() => onSelect(centro)}
                >
                    <div>{centro.IDSeccion}</div>  <div>{centro.DescSeccion}</div>
                </button>
            ))}
        </div>
    );
};

export default CentrosMenu;
