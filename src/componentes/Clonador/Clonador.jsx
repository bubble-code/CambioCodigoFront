import { useState, useRef } from 'react';
import axios from 'axios';
import {
    FormGroup,
    InputGroup,
    Button,
    HTMLSelect,
    Callout,
    Spinner,
} from '@blueprintjs/core';
import ArticuloDashboard from '../ArticuloDashboard/ArticuloDashboard';

const Clonador = () => {
    const [oldIdArticulo, setOldIdArticulo] = useState('');
    const [newIdArticulo, setNewIdArticulo] = useState('');
    const [baseDatos, setBaseDatos] = useState('solmicro');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success'); // 'success' | 'danger'
    const [suggestions, setSuggestions] = useState([]);
    const [cargando, setCargando] = useState(false);
    const descArticuloRef = useRef(null);

    const listDB = [
        { value: 'solmicro', label: 'SOLMICRO' },
        { value: 'mobi-endo', label: 'MOBI-ENDO' },
    ];

    const handleBaseDatos = (e) => {
        setBaseDatos(e.target.value);
        setSuggestions([]);
        setOldIdArticulo('');
        setNewIdArticulo('');
        if (descArticuloRef.current) descArticuloRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setMessage('');
        try {
            const response = await fetch('http://10.0.0.19:5000/recoding_articulo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    old_id_articulo: oldIdArticulo,
                    new_id_articulo: newIdArticulo,
                    base_datos: baseDatos,
                }),
            });
            const data = await response.json();
            if (data.status === 'success') {
                setMessage('Artículo actualizado con éxito');
                setMessageType('success');
                setNewIdArticulo('');
                setOldIdArticulo('');
                setSuggestions([]);
                if (descArticuloRef.current) descArticuloRef.current.value = '';
            } else {
                setMessage('Hubo un error al actualizar el artículo');
                setMessageType('danger');
            }
        } catch (err) {
            setMessage('Error de conexión con el servidor');
            setMessageType('danger');
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
                const response = await axios.get(
                    `http://10.0.0.19:5000/autocomplete?search=${search}&db=${baseDatos}`
                );
                setSuggestions(response.data);
            } catch (error) {
                console.error('Error autocomplete:', error);
            }
        } else {
            setSuggestions([]);
            if (descArticuloRef.current) descArticuloRef.current.value = '';
        }
    };

    const handleSuggestionClick = (idArticulo, descArticulo) => {
        setOldIdArticulo(idArticulo);
        if (descArticuloRef.current) descArticuloRef.current.value = descArticulo;
        setSuggestions([]);
    };

    return (
        /* bp5-dark activa el dark theme de Blueprint en todo el árbol */
        <div className="w-full" style={{ color: 'var(--app-text)' }}>
            <div
                className="max-w-2xl mx-auto mt-10 p-6 rounded-lg"
                style={{
                    backgroundColor: 'var(--app-surface)',
                    border: '1px solid var(--app-border)',
                }}
            >
                <h1
                    className="text-lg font-semibold mb-6 tracking-wide uppercase"
                    style={{ color: 'var(--app-text)', letterSpacing: '0.12em' }}
                >
                    Clonador de Artículos
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Base de datos */}
                    <FormGroup label="Base de datos" labelFor="select-db">
                        <HTMLSelect
                            id="select-db"
                            value={baseDatos}
                            onChange={handleBaseDatos}
                            options={listDB}
                            fill
                        />
                    </FormGroup>

                    {/* ID Artículo origen con autocomplete */}
                    <FormGroup label="Artículo origen (ID)" labelFor="input-old-id">
                        <div className="relative">
                            <InputGroup
                                id="input-old-id"
                                value={oldIdArticulo}
                                onChange={handleSearchChange}
                                placeholder="Buscar artículo..."
                                fill
                                autoComplete="off"
                            />
                            {suggestions.length > 0 && (
                                <ul
                                    className="absolute z-20 w-full mt-1 rounded-md overflow-y-auto max-h-44"
                                    style={{
                                        backgroundColor: '#fff',
                                        border: '1px solid rgba(0,0,0,0.12)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    }}
                                >
                                    {suggestions.map(({ IDArticulo, DescArticulo }, i) => (
                                        <li
                                            key={i}
                                            className="px-3 py-2 text-sm cursor-pointer transition-colors"
                                            style={{ color: '#1C1C1E' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                            onClick={() => handleSuggestionClick(IDArticulo, DescArticulo)}
                                        >
                                            <span className="font-medium">{IDArticulo}</span>
                                            <span style={{ color: 'var(--app-muted)' }}> — {DescArticulo}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </FormGroup>

                    {/* Descripción (solo lectura) */}
                    <FormGroup label="Descripción" labelFor="input-desc">
                        <InputGroup
                            id="input-desc"
                            inputRef={descArticuloRef}
                            readOnly
                            fill
                            placeholder="Se completará al seleccionar un artículo"
                            style={{ opacity: 0.7 }}
                        />
                    </FormGroup>

                    {/* Nuevo ID */}
                    <FormGroup label="Nuevo ID de artículo" labelFor="input-new-id">
                        <InputGroup
                            id="input-new-id"
                            value={newIdArticulo}
                            onChange={e => setNewIdArticulo(e.target.value)}
                            placeholder="Nuevo código..."
                            fill
                        />
                    </FormGroup>

                    {/* Botón */}
                    <Button
                        type="submit"
                        intent="primary"
                        fill
                        large
                        disabled={newIdArticulo.trim().length < 3 || cargando}
                        loading={cargando}
                    >
                        {cargando ? 'Renombrando...' : 'Renombrar Artículo'}
                    </Button>
                </form>

                {/* Mensaje resultado */}
                {message && (
                    <div className="mt-4">
                        <Callout intent={messageType} compact>
                            {message}
                        </Callout>
                    </div>
                )}
            </div>

            {/* Sección detalles del artículo */}
            {oldIdArticulo && (
                <div
                    className="max-w-7xl mx-auto mt-8 pt-6 px-4"
                    style={{ borderTop: '1px solid var(--app-border)' }}
                >
                    <p
                        className="text-xs font-semibold uppercase tracking-widest mb-4"
                        style={{ color: 'var(--app-muted)' }}
                    >
                        Detalles del Artículo
                    </p>
                    <ArticuloDashboard idArticulo={oldIdArticulo} />
                </div>
            )}
        </div>
    );
};

export default Clonador;
