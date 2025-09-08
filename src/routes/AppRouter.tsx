import { Route, Routes, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import PublicRoute from '../components/PrivateRoute/PublicRoute';
const Login = lazy(() => import('../screens/auth/Login'));
const Signup = lazy(() => import('../screens/auth/Signup'));
const GameCreation = lazy(() => import ('../components/GameCreation/NewGame'))
const Profile = lazy(() => import('../screens/Profile/Profile'));
const Layout =lazy(()=>import('../container/Layout/Layout'))
const Verify =lazy(()=>import('../components/EmailVerification/EmailVerification'))
const Failed =lazy(()=>import('../components/EmailVerification/VerificationFailed'))
const Dashboard =lazy(()=>import('../components/Dashboard/Dashboard'))
const Pokerboard =lazy(()=>import('../components/Pokerboard/Pokerboard'))
const Signupsucces= lazy(()=>import('../screens/auth/SignupSuccess'));

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>}></Route>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/Signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/verified/:token" element={<PublicRoute>< Verify /></PublicRoute>} />
      <Route path="/failed" element={<PublicRoute><Failed /></PublicRoute>} />
      <Route path="/g" element={<GameCreation/>} />
      <Route path="/" element={<Layout />}>
      <Route path="/SignupSuccessfull" element={<Signupsucces />}></Route>
      <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/gamecreation"
          element={
            <PrivateRoute>
              <GameCreation />
            </PrivateRoute>
          }
        />
        <Route
          path="/poker/:pokerid/:role"
          element={
            <PrivateRoute>
              <Pokerboard/>
            </PrivateRoute>
          }
        />
        </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRouter;
