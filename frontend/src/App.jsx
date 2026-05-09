import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ExpertDetailPage from './pages/ExpertDetailPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import NotFoundPage from './pages/NotFoundPage';
import Toast from './components/Toast';
import { ToastProvider } from './context/ToastContext';

const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Toast />
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/experts/:id" element={<ExpertDetailPage />} />
            <Route path="/book/:expertId" element={<BookingPage />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
