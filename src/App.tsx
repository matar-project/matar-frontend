import { Navigate, Route, Routes } from 'react-router-dom';
import { GuestRoute } from './Components/GuestRoute';
import { ProtectedRoute } from './Components/ProtectedRoute';
import Home from './Pages/home';
import Login from './Pages/login';
import Signup from './Pages/signup';

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
