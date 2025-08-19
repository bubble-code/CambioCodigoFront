import { useEffect, useState } from 'react';
import { CargaService } from '../../services/apiService';

export function useCentros() {
    const [centros, setCentros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCentros = async () => {
            setLoading(true);
            setError(null);
            try {
                const dataCentros = await CargaService.getCentros();
                setCentros(dataCentros);
            } catch (err) {
                console.error("Error al obtener los centros:", err);
                setError("No se pudo cargar la información");
            } finally {
                setLoading(false);
            }
        };
        fetchCentros();
    }, []);

    return { centros, loading, error };
}
