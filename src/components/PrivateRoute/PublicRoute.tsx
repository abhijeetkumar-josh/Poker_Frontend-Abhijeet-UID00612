import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from '../../store/store';
import { PropsWithChildren } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const PublicRoute = ({ children }: PropsWithChildren) => {
  // const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  // return isAuthenticated ?<Navigate to="/profile" replace />:children
    const { isAuthenticated, isAuthChecked } = useSelector((state: RootState) => state.auth);
    if (!isAuthChecked) {
        return <Skeleton height={30}  count={10} />
    }
    if (isAuthenticated) {
        return <Navigate to="profile" replace />;
    }
    return children;

};

export default PublicRoute;

