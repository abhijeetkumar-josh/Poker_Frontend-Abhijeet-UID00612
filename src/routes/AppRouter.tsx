import { Route, Routes, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
;
const Login = lazy(() => import('../screens/auth/Login'));
const Signup = lazy(() => import('../screens/auth/Signup'));
const Profile = lazy(() => import('../screens/Profile/Profile'));
const Layout =lazy(()=>import('../container/Layout/Layout'))
const Verify =lazy(()=>import('../components/EmailVerification/EmailVerification'))
const Failed =lazy(()=>import('../components/EmailVerification/VerificationFailed'))

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/verified/:uid/:token" element={<Verify />} />
      <Route path="/failed" element={<Failed />} />
      <Route path="/" element={<Layout />}>
      <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRouter;
