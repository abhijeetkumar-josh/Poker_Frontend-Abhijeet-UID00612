import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { PropsWithChildren } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const {isAuthenticated,isAuthChecked} = useSelector((state: RootState) => state.auth);
  if (!isAuthChecked) return <Skeleton height={30}  count={10} /> 
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

