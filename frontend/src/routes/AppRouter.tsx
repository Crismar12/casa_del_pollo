
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../App';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import OrdersPage from '../pages/OrdersPage';
import { AdminPage } from '../pages/AdminPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import PrivateRoutes from "../routes/PrivateRoutes";
import AdminRoute from "../routes/AdminRoute";
import Login from '../pages/Login';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/*  Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/*  Rutas protegidas */}
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <PrivateRoutes>
                <App />
              </PrivateRoutes>
            </ErrorBoundary>
          }
        >
          {/* Página principal = productos */}
          <Route index element={<ProductPage />} />
          <Route path="producto" element={<ProductPage />} />
          <Route path="carrito" element={<CartPage />} />
          <Route path="pedidos" element={<OrdersPage />} />
          <Route path="admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};