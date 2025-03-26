import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import { TransactionsPage } from './pages/Transactions';
import UploadStatement from './pages/UploadStatement';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/upload" element={<UploadStatement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;