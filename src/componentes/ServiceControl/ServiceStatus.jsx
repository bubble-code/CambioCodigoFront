
import { useEffect, useState } from "react";
import axios from "axios";

const ServiceStatus = ({ serviceName }) => {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchServiceStatus = async () => {
        setLoading(true);
        setStatus("");
        try {
            const response = await axios.get(`http://10.0.0.19:5000/service_status?service_name=${serviceName}`);
            setStatus('✅'+response.data.status);
        } catch (error) {
            setStatus("❌ Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-3">
            <p>
                <strong>Estado:</strong> {status}
            </p>
            <button
                onClick={fetchServiceStatus}
                disabled={loading}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400"
            >
                {loading ? "Cargando..." : "🔄 Obtener Estado"}
            </button>
        </div>
    );
};

export default ServiceStatus;
