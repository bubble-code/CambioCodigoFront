import { useState } from 'react';
import ExcelImporter from '../ExcelImport/ExcelImporter';
import DataTable from '../DataTable/DataTable';
import Modal from '../Modal/Modal';
import axios from 'axios';

const ExcelViewer = () => {
    const [excelData, setExcelData] = useState([]);
    const [matchingItems, setMatchingItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal,setShowModal] = useState(false);

    const handleFileLoaded = (data) => {
        setExcelData(data);
    };
    const checkItemsInDatabase = async () => {
        setLoading(true);
        try {
            const listaID = excelData.slice(1).reduce((acc, cur) => {
                acc[cur[1]] = true
                return acc
            }, {});

            //const response = await axios.get(`http://192.168.1.145:5000/articulos?listaID=${Object.keys(listaID)}`);
            const response = await axios.get(`http://10.0.0.19:5000/articulos?listaID=${Object.keys(listaID)}`);
            const existingItems = response.data
            setMatchingItems(existingItems);
        } catch (error) {
            console.error("Error checking items in database: ", error);
        } finally {
            setLoading(false);
        }
    };

    const generarOrdenes = async () => {
        const response = await axios.get(`http://10.0.0.19:5000/generarOF`);
        console.log(response)
       /* setLoading(true);
        const listaID = excelData.slice(1).reduce((acc, cur) => {
            const lanzamiento = cur[0]
            const idArticulo = cur[1]
           // console.log(lanzamiento)
            //console.log(idArticulo)
            if(!acc[lanzamiento]){
                acc[lanzamiento] = {}
            }
            if (!acc[lanzamiento][idArticulo]) {
                acc[lanzamiento][idArticulo]=[]
            }
            acc[lanzamiento][idArticulo].push(cur)
            return acc;
        }, {});
        let updatedExcelData = [...excelData];  // Copia de los datos originales para actualizarlos
        
        try {
            for (let lanzamiento in listaID) {
                for(let articuloID in listaID[lanzamiento] ){
                    const registros = listaID[lanzamiento][articuloID];  
                    console.log("registros :",registros)
                    //const response = await fetch('http://192.168.1.145:5000/generarOF', {
                        const response = await fetch('http://10.0.0.19:5000/generarOF', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                listaID: { [articuloID]: registros }  // Enviar la agrupación específica
                            }),
                        });
                        
                        const data = await response.json();
                        //console.log("data:",data.message)
                        const mensaje = data.message || "Error al generar la Orden";
                        if (data.status === "success") {
                            //console.log(`Orden para el artículo ${articuloID} generada con éxito`);
                            // Marcar los registros como exitosos en `updatedExcelData`
                            const newExcelData = updatedExcelData.map((row) => {
                                if (row[0] == lanzamiento && row[1] == articuloID) {
                                    // Si la fila ya tiene una columna de resultado, actualízala
                                    if (row.length > 9) {
                                        row[10] = mensaje;  // Suponiendo que la última columna es la 11 (índice 10)
                                    } else {
                                        // Si no, añade la columna del resultado
                                        row.push(mensaje);
                                    }
                                }
                                return row;
                            });
                            setExcelData(newExcelData);
                        } else {
                            console.error(`Error en la generación de la orden para el artículo ${articuloID}`, data);
                            // Marcar los registros como fallidos
                            registros.forEach((registro) => {
                                const index = updatedExcelData.findIndex(row => row[0] === articuloID);
                                if (index !== -1) {
                                    updatedExcelData[index] = [...updatedExcelData[index], "Error al generar la Orden"];
                                }
                            });
                        }
                }
            }
        } catch (error) {
            console.error("Error al procesar las órdenes: ", error);
            // En caso de error en la solicitud, marcar todos los registros con un fallo general
            for (let articuloID in listaID) {
                const registros = listaID[articuloID];
                registros.forEach((registro) => {
                    const index = updatedExcelData.findIndex(row => row[0] === articuloID);
                    if (index !== -1) {
                        updatedExcelData[index] = [...updatedExcelData[index], "Error al generar la Orden"];
                    }
                });
            }
        } finally {
            // Aquí puedes actualizar la tabla o interfaz de usuario con `updatedExcelData`
            // Dependiendo de cómo se gestiona el estado de la tabla, esto puede variar
            setLoading(false);
        }*/
    }
    

    const resetTable = () => {
        // Funcionalidad para reiniciar la tabla
        setExcelData([]);
        setMatchingItems([]);
    };
    const copiarTable = () => {
        const dataToText = excelData.slice(1).map(row => {
            return row.join('\t')
        }).join('\n');
        console.log(dataToText);
        const textArea = document.createElement('textarea');
        textArea.value = dataToText
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setShowModal(true);
    };

    return (
        <div className="container mx-auto p-4">
            <ExcelImporter onFileLoaded={handleFileLoaded} />
            {loading && (
                <div className="mt-4 flex items-center">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6 mr-2"></div>
                    <p className="text-sm text-gray-600">Cargando... </p>
                    {/* {progress}% */}
                </div>
            )}
            {excelData.length > 0 && <div className="flex space-x-4 my-4">
                <button
                    onClick={checkItemsInDatabase}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Verificar Artículos
                </button>
                <button
                    onClick={generarOrdenes}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                    Generar ordenes
                </button>
                <button
                    onClick={resetTable}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                    Reiniciar Tabla
                </button>
                <button
                    onClick={copiarTable}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                    Copiar Tabla
                </button>
            </div>}
            {excelData.length > 0 && <DataTable data={excelData} matchingItems={matchingItems} />}
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <h2>Datos Copiados</h2>                    
                </Modal>
            )}
        </div>
    );
};

export default ExcelViewer;
