
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../App';
import PrivateRoutes from "../routes/PrivateRoutes";
import AdminRoute from "../routes/AdminRoute";
import { ErrorBoundary } from '../shared/components/ErrorBoundary';

const ProductPage = React.lazy(() => import('../pages/ProductPage').then(m => ({ default: m.ProductPage })));
const CartPage = React.lazy(() => import('../pages/CartPage').then(m => ({ default: m.CartPage })));
const OrdersPage = React.lazy(() => import('../pages/OrdersPage').then(m => ({ default: m.default })));
const AdminPage = React.lazy(() => import('../pages/AdminPage').then(m => ({ default: m.AdminPage })));
const NotFoundPage = React.lazy(() => import('../pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const Login = React.lazy(() => import('../pages/Login').then(m => ({ default: m.default })));

export const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div></div>}>
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
      </Suspense>
    </Router>
  );
};