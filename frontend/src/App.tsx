import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Home from './pages/Home';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      {/* More routes will go here later, like /dashboard */}
        {/* ...other routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;