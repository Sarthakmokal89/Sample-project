// For the purpose of this demo, the Admin Dashboard will mirror the Client Dashboard.
// In a real application, this would contain different, admin-specific components and data.
// Fix: Changed alias imports to relative paths for clarity and to resolve build issues.
import ClientDashboard from './ClientDashboard';

const AdminDashboard: React.FC = () => {
    return <ClientDashboard />;
};

export default AdminDashboard;
