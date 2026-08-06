import './App.css'

import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { AppHeader } from "./shared/components/layout/Header";
import { AppSidebar } from "./shared/components/layout/Sidebar";
import { AppFooter } from "./shared/components/layout/Footer";
import { Modal } from "./features/admin/components/Modal";
import { Button } from "./shared/components/iu";
import { getActiveOrdersCount } from "./features/orders/services/order.service";

import { Notification } from './shared/components/Notification';
import { useNotificationContext } from './shared/context/NotificationContext';
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./shared/hooks/useAuth"; 


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
  const { notification, hideNotification } = useNotificationContext();
  const navigate = useNavigate();
  const { logout, usuario } = useAuth(); 
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);

  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log('toggleSidebar called, isSidebarOpen:', !isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    console.log('closeSidebar called');
  };

  
  const handleLogout = async () => {
    if (usuario?.rol !== 'admin') {
      logout(); 
      navigate('/login');
      return;
    }
    const activeCount = await getActiveOrdersCount();
    if (activeCount > 0) {
      setActiveOrdersCount(activeCount);
      setIsLogoutModalOpen(true);
      return;
    }
    logout(); 
    navigate('/login'); 
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout(); 
    navigate('/login'); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Encabezado */}
      <AppHeader
        onMenuClick={toggleSidebar}
        className=""
      />

      {/* Cuerpo principal */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar lateral */}
        <AppSidebar
          isOpen={isSidebarOpen}
          onLinkClick={closeSidebar}
          onLogoutClick={handleLogout}
          isDesktop={isDesktop}
        />

        {/* Overlay — cierra el sidebar al hacer clic fuera */}
        {!isDesktop && isSidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-black/50"
            onClick={closeSidebar}
          />
        )}

        
                <main
                  className={`flex-1 p-6 bg-gray-50 dark:bg-gray-950 transition-all duration-300 overflow-y-auto min-h-[calc(100vh-4rem)]`}          onClick={() => !isDesktop && isSidebarOpen && closeSidebar()}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <AppFooter />
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        action={notification.action}
        onClose={hideNotification}
      />
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Cerrar sesión"
      >
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Todavía hay <strong>{activeOrdersCount}</strong> pedido(s) sin atender. Si cierras sesión, no podrás
            seguirlos hasta volver a ingresar. ¿Deseas cerrar sesión de todas formas?
          </p>
          <div className="flex justify-center gap-2">
            <Button
              onClick={() => setIsLogoutModalOpen(false)}
              variant="secondary"
              className="px-4 py-2"
            >
              Seguir trabajando
            </Button>
            <Button
              onClick={handleConfirmLogout}
              gradient
              className="px-4 py-2"
            >
              Cerrar sesión igual
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;