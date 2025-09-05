import { useState, useEffect } from "react";
import { CargaService } from "../../services/apiService";

export const useCargaByCentros = (idSeccion, listOfs) => {
    const [data, setData] = useState([])
    const [loadingData, setLoading] = useState(false)
    const [errorData, setError] = useState(null)

    useEffect(() => {
        if (!idSeccion) return

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {

                const result = await CargaService.CargaPorSeccion(idSeccion, listOfs)
                setData(result)
            }
            catch (err) {
                console.error("Error al obtener los centros:", err);
                setError("No se pudo cargar la información");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [idSeccion, listOfs])

    return [data, loadingData, errorData]
}