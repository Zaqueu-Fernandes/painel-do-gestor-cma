import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex items-center gap-4 animate-in slide-in-from-bottom">
      <img
        src="https://i.ibb.co/yFHW1DxL/Gemini-CMA-logo-Photoroom.png"
        alt="Logo"
        className="w-12 h-12 object-contain rounded-lg"
      />
      <div className="flex-1">
        <p className="font-semibold text-green-800 text-sm">Painel do Gestor</p>
        <p className="text-xs text-gray-500">Instalar app no seu dispositivo</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setShow(false)}
          className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
        >
          Agora não
        </button>
        <button
          onClick={handleInstall}
          className="bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
        >
          Instalar
        </button>
      </div>
    </div>
  );
}
