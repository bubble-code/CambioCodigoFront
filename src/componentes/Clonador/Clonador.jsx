import { useState, useRef } from 'react';
import axios from 'axios';
import ArticuloDashboard from '../ArticuloDashboard/ArticuloDashboard'

const UpdateArticuloForm = () => {
    const [oldIdArticulo, setOldIdArticulo] = useState('');
    const [newIdArticulo, setNewIdArticulo] = useState('');
    const [message, setMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [cargando, setCargando] = useState(false);

    const descArticuloRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setCargando(true);
        try {

            //const response = await fetch('http://192.168.32.12:5000/recoding_articulo', {
            const response = await fetch('http://10.0.0.19:5000/recoding_articulo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    old_id_articulo: oldIdArticulo,
                    new_id_articulo: newIdArticulo,
                }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                setMessage('Articulo actualizado con éxito');
                setNewIdArticulo('');
                setOldIdArticulo('');
                setSuggestions([]);
                descArticuloRef.current.value = '';
            } else {
                setMessage('Hubo un error al actualizar el articulo');
            }
        } catch (err) {
            // setError(err.response?.data?.message || 'Error al obtener listado de Cargas');
            console.error('Error:', err);
        } finally {
            setCargando(false);
        }
    };

    const handleSearchChange = async (e) => {
        const search = e.target.value;
        setMessage('');
        setOldIdArticulo(search);
        if (search.length > 2) {
            try {
                const response = await axios.get(`http://10.0.0.19:5000/autocomplete?search=${search}`);
                // const response = await axios.get(`http://192.168.1.145/autocomplete?search=${search}`);
                setSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching autocomplete suggestions', error);
            }
        } else {
            setSuggestions([]);
            descArticuloRef.current.value = "";
        }
    };

    const handleSuggestionClick = (idArticulo, descArticulo) => {
        setOldIdArticulo(idArticulo);
        descArticuloRef.current.value = descArticulo;
        setSuggestions([]);
    };

    return (
        <div className="w-full">
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
                <h1 className="text-xl font-bold mb-4">Clonador de Artículos</h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex space-x-4">
                        <div className="w-1/2 relative">
                            <label className="block text-sm font-medium text-gray-700">Old ID Articulo:</label>
                            <input
                                type="text"
                                value={oldIdArticulo}
                                onChange={handleSearchChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {suggestions.length > 0 && (
                                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 w-full overflow-y-auto">
                                    {suggestions.map(({ IDArticulo, DescArticulo }, index) => (
                                        <li className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                                            key={index} onClick={() => handleSuggestionClick(IDArticulo, DescArticulo)}>
                                            {IDArticulo} - {DescArticulo}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Descripcion:</label>
                            <input
                                type="text"
                                ref={descArticuloRef}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div >
                        <label className="block text-sm font-medium text-gray-700">New ID Articulo:</label>
                        <input
                            type="text"
                            // ref={newIdArticuloRef}
                            value={newIdArticulo}
                            onChange={(e) => setNewIdArticulo(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="submit"
                        disabled={newIdArticulo.trim().length<3 || cargando}
                    >{cargando ? "Renombrando" : "Renombrar Articulo"}</button>
                </form>
                {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
            </div>

            {/* Separador visual */}
            <div className="w-full mt-6 border-t-2 border-orange-500 px-4">
                <h2 className="text-xs font-bold text-orange-500 mt-2">Detalles del Artículo</h2>
            </div>

            <div className="w-full px-4 mt-6 text-sm text-gray-700 font-light">
                <ArticuloDashboard idArticulo={oldIdArticulo}/>
            </div>

        </div>
    );
};

export default UpdateArticuloForm;
