// For the purpose of this demo, the Admin Dashboard will mirror the Client Dashboard.
// In a real application, this would contain different, admin-specific components and data.
import ClientDashboard from '@/pages/ClientDashboard';

const AdminDashboard: React.FC = () => {
    return <ClientDashboard />;
};

export default AdminDashboard;
