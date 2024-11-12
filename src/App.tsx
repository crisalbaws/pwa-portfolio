import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import InstallButton from './components/InstallButton';
import Loader from './components/Loader';
import TicketList from './components/TicketsList';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const App: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState<boolean>(false);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  useEffect(() => {
    const checkStandaloneMode = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsInStandaloneMode(isStandalone);
      console.log('Modo standalone:', isStandalone);
    };

    checkStandaloneMode(); // Initial check

    // Add listener for changes to the display-mode
    const mediaQueryList = window.matchMedia('(display-mode: standalone)');
    mediaQueryList.addEventListener('change', checkStandaloneMode);

    // Clean up the event listener on unmount
    return () => {
      mediaQueryList.removeEventListener('change', checkStandaloneMode);
    };
  }, []);

  useEffect(() => {
    if (isIOS && !isInStandaloneMode) {
      alert('Para instalar la aplicación, toca el botón de compartir en Safari y selecciona "Añadir a pantalla de inicio".');
    }
  }, [isInStandaloneMode, isIOS]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      console.log('Evento beforeinstallprompt capturado:', promptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('El usuario aceptó instalar la aplicación');
        } else {
          console.log('El usuario rechazó la instalación');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <HashRouter>
      <div className="container-app">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tickets" element={<TicketList />} />
        </Routes>
      </div>
      <InstallButton
        deferredPrompt={deferredPrompt}
        isInStandaloneMode={isInStandaloneMode}
        onInstall={handleInstall}
      />
      <Loader />
    </HashRouter>
  );
}

export default App;
