import { useState } from "react";
import axios from "axios";

const ServiceActions = ({ serviceName, onActionCompleted }) => {
    const [loadingReiniciar, setLoadingReiniciar] = useState(false);
    const [loadingIniciar, setLoadingIniciar] = useState(false);
    const [loadingDetener, setLoadingDetener] = useState(false);
    const [message, setMessage] = useState("");

    const handleServiceAction = async (action) => {
        switch (action) {
            case "restart":
                setLoadingReiniciar(true);
                setLoadingDetener(false)
                setLoadingIniciar(false);
                break;
            case "start":
                setLoadingReiniciar(false);
                setLoadingDetener(false)
                setLoadingIniciar(true);
                break;
            case "stop":
                setLoadingReiniciar(false);
                setLoadingDetener(true)
                setLoadingIniciar(false);
                break;
        }
        setMessage("");

        try {
            const response = await axios.post(`http://10.0.0.19:5000/${action}_service`, { service_name: serviceName });

            if (response.data.status === "success") {
                setMessage(`✅ Servicio ${action} correctamente.`);
                onActionCompleted(); // Llamamos a la función del padre para actualizar estado
            } else {
                setMessage(`⚠️ Hubo un problema: ${response.data.error}`);
            }
        } catch (error) {
            setMessage(`❌ Error al ${action} el servicio.`);
        } finally {
            setLoadingReiniciar(false);
            setLoadingDetener(false)
            setLoadingIniciar(false);
        }
    };

    return (
        <div>
            <button
                onClick={() => handleServiceAction("restart")}
                disabled={loadingReiniciar}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 mr-2"
            >
                {loadingReiniciar ? "Reiniciando..." : "🔄 Reiniciar"}
            </button>

            <button
                onClick={() => handleServiceAction("start")}
                disabled={loadingIniciar}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 mr-2"
            >
                {loadingIniciar ? "Iniciando..." : "▶️ Iniciar"}
            </button>

            <button
                onClick={() => handleServiceAction("stop")}
                disabled={loadingDetener}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
            >
                {loadingDetener ? "Deteniendo..." : "⏹️ Detener"}
            </button>

            {message && <p className="mt-2 text-gray-700">{message}</p>}
        </div>
    );
};

export default ServiceActions;
