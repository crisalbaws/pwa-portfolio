import React from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallButtonProps {
    deferredPrompt: BeforeInstallPromptEvent | null;
    isInStandaloneMode: boolean;
    onInstall: () => void;
}

const InstallButton: React.FC<InstallButtonProps> = ({ deferredPrompt,
    isInStandaloneMode, onInstall }) => {
    if (
        isInStandaloneMode || !deferredPrompt) {
        return null;
    }

    return (
        <button
            style={{
                position: 'fixed',
                bottom: '16px',
                right: '16px',
                padding: '8px 16px',
                fontSize: '16px',
                backgroundColor: '#418091',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
            }}
            onClick={onInstall}
        >
            Instalar Aplicación
        </button>
    );
};

export default InstallButton;
