import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const PrivateRoute = () => {
    const { user } = useContext(UserContext);
    const redirect = '/login';
    return user ? <Outlet /> : <Navigate to={redirect} />;
}
export default PrivateRoute