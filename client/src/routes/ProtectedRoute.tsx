import { Navigate } from 'react-router-dom';
import { FC, ReactNode } from 'react';
import { useAppSelector } from '../store/hooks';
import { AuthStateType} from '../utils/type';
import {useGlobal} from '../store/hooks';

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children}): ReactNode => {
  const auth: AuthStateType = useAppSelector((state) => state.auth);
  const { showMessage } = useGlobal();

  const token: string | null = auth.token;

  if (!token || token === null) {
    return <Navigate to="/signin" />;
  }

  // if (auth.role !== 'Vendor' && auth.role !== 'Admin') {
  //   showMessage("You don't have permission to access this page!");
  //   // error page
  //   // return <Navigate to="/error" />
  //   return <Navigate to="/" />
  // }
  return children;
};

const ProtectedRouteEmployee: FC<ProtectedRouteProps> = ({ children }): ReactNode => {
  const auth: AuthStateType = useAppSelector((state) => state.auth);
  const { showMessage } = useGlobal();

  const token: string | null = auth.token;

  if (!token || token === null) {
    return <Navigate to="/signin" />;
  }

  if (auth.user?.role !== 'Employee') {
    showMessage("You don't have permission to access this page!");
    // error page
    // return <Navigate to="/error" />
    return <Navigate to="/" />
  }
  return children;
}
 
const ProtectedRouteHR: FC<ProtectedRouteProps> = ({ children }): ReactNode => {
  const auth: AuthStateType = useAppSelector((state) => state.auth);
  const { showMessage } = useGlobal();

  const token: string | null = auth.token;

  if (!token || token === null) {
    return <Navigate to="/signin" />;
  }

  if (auth.user?.role !== 'HR') {
    showMessage("You don't have permission to access this page!");
    // error page
    // return <Navigate to="/error" />
    return <Navigate to="/" />
  }
  return children;
}

export { ProtectedRoute, ProtectedRouteEmployee, ProtectedRouteHR };
