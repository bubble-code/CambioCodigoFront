import React from 'react';
import TablaDetallesArticulo from './TablaDetallesArticulo'
import CardPrecios from './CardPrecios'

const ArticuloDashboard = ({ idArticulo }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-light text-gray-700">
            <div className="bg-white shadow-md rounded-md p-4">
                <TablaDetallesArticulo idArticulo={idArticulo} titulo={"Almacen"} endpoint={"http://10.0.0.19:5000/getAlmacen"} tablaId={"Almacen"} />
            </div>
            <div className="bg-white shadow-md rounded-md p-4">
                <CardPrecios idArticulo={idArticulo} />
            </div>
            <div className="bg-white shadow-md rounded-md p-4">
                <TablaDetallesArticulo idArticulo={idArticulo} titulo={"Implosión"} endpoint={"http://10.0.0.19:5000/getImplosion"} tablaId={"Imp"} />
            </div>
            <div className="bg-white shadow-md rounded-md p-4">
                <TablaDetallesArticulo idArticulo={idArticulo} titulo={"Pedidos de Ventas Activos"} endpoint={"http://10.0.0.19:5000/getPV"} tablaId={"PV"} />
            </div>
            <div className="bg-white shadow-md rounded-md p-4">
                <TablaDetallesArticulo idArticulo={idArticulo} titulo={"Pedidos de Compras Activos"} endpoint={"http://10.0.0.19:5000/getPC"} tablaId={"PC"} />
            </div>
            <div className="bg-white shadow-md rounded-md p-4">
                <TablaDetallesArticulo idArticulo={idArticulo} titulo={"OFs en Curso"} endpoint={"http://10.0.0.19:5000/getOfs"} tablaId={"Ofs"} />
            </div>
        </div>

    );
};

export default ArticuloDashboard;
