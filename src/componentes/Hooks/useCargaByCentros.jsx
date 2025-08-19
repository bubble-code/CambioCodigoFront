import { useState, useEffect } from "react";
import { CargaService } from "../../services/apiService";

export const useCargaByCentros = (idCentro, listOfs) => {
    const [data, setData] = useState([])
    const [loadingData, setLoading] = useState(false)
    const [errorData, setError] = useState(null)

    useEffect(() => {
        if (!idCentro) return

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {

                const result = await CargaService.CargaPorCentros(idCentro, listOfs)
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
    }, [idCentro, listOfs])

    return [data, loadingData, errorData]
}