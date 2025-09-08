import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import AuthLoader from './screens/auth/AuthLoader';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <AuthLoader />
      <Suspense fallback={<Skeleton height={30}  count={10} /> }>
        <AppRouter />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
