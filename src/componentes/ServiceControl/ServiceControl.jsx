import { useState } from "react";
import axios from "axios";
import ServiceStatus from "./ServiceStatus";
import ServiceActions from "./ServiceAction";

const ServiceControl = ()=>{
    const serviceName = "MESHostService"; 
    const [refresh, setRefresh] = useState(false);

    const updateStatus = () => setRefresh(!refresh);

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-lg font-semibold mb-4">Opciones de Administracion </h2>
            <ServiceStatus serviceName={serviceName} key={refresh} />
            <ServiceActions serviceName={serviceName} onActionCompleted={updateStatus} />
        </div>
    );
}

export default ServiceControl;