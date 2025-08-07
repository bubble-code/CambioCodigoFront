import ServiceControl from "./ServiceControl";

const Dashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Panel de Control de Servicio MES</h1>
            <ServiceControl />
        </div>
    );
};

export default Dashboard;
