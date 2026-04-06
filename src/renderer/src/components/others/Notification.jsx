import React, { useState, useEffect, useContext } from 'react'
import { NotificationContext } from '@/context/notificationContext.jsx'
import cutText from '@/hooks/cutText.js'

// Componente Notification para cada notificación
const Notification = ({ status, msg, onRemove }) => {
  const statusClasses = {
    error: "bg-red-500  ",
    success: "bg-green-500 ",
    info: "bg-orange-500 ",
  };

  useEffect(() => {
    const timer = setTimeout(onRemove, 3000); // Eliminar la notificación después de 2.5 segundos
    return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta antes de que se complete el tiempo
  }, [onRemove]);

  return (
    <div className="flex rounded-sm overflow-hidden bg-secundary pr-5 py-1 items-center select-none">
      <div
        className={`h-10 w-1 mr-2 items-center ${statusClasses[status]}  shadow-md transition-opacity duration-500 ease-in-out`}
      ></div>
      <p className=" text-sm font-medium">
        {cutText({
          t: msg ,
          l: 100,
        })}
      </p>
    </div>
  );
};

// Componente Notifications para manejar las notificaciones y el botón
const Notifications = () => {
  const { notifications, setNotifications } = useContext(NotificationContext); 
  const [activeNotifications, setActiveNotifications] = useState([]);

  useEffect(() => {
    setActiveNotifications(notifications.slice(0, 5));
  }, [notifications]);

  // Función para manejar la eliminación de la notificación con un pequeño retraso
  const handleRemoveNotification = (index) => {
    setActiveNotifications((prevNotifications) => {
      const updatedNotifications = [...prevNotifications];
      updatedNotifications.splice(index, 1); // Eliminar la notificación
      return updatedNotifications;
    });

    setNotifications((prevNotifications) => {
      const updatedNotifications = [...prevNotifications];
      updatedNotifications.splice(index, 1); // Eliminar la notificación
      return updatedNotifications;
    });
  };

  return (
    <div className="fixed  right-0 top-8 space-y-2 w-auto max-w-96 z-[9999999]">
      {activeNotifications.map((notif, index) => (
        <div
          key={index}
          className={`transition-opacity duration-500 ease-in-out opacity-100`}
          // Se establece opacity en 100 para que sea visible cuando la notificación entre
          onAnimationEnd={handleRemoveNotification} // Llamar a handleRemoveNotification después de la animación
        >
          <Notification
            status={notif.status}
            msg={notif.msg}
            onRemove={() => handleRemoveNotification(index)} // Eliminar después de la animación
          />
        </div>
      ))}
    </div>
  );
};

export default Notifications;
