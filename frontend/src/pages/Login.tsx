import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../shared/hooks/useNotification';
import React from 'react';
import { Input } from '../shared/components/iu';
import { Button } from '../shared/components/iu';
import { useAuth } from '../shared/hooks/useAuth'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [generalError, setGeneralError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { login } = useAuth(); 

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(undefined);
    setPasswordError(undefined);
    setGeneralError(undefined);

    let hasError = false;
    if (!email) {
      setEmailError('El correo electrónico es requerido.');
      hasError = true;
    }
    if (!password) {
      setPasswordError('La contraseña es requerida.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      await login(email, password); 
      showNotification('¡Bienvenido!', 'success');
      navigate('/');
    } catch (error: unknown) {
      console.error('Error en la página de login:', error);
      setGeneralError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-orange-400 via-red-500 to-orange-700">
      <div className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md text-center border border-orange-300">
        <div className="mb-4">
          <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-sm">
            🐔 El Paraíso del Pollo
          </h1>
          <p className="text-gray-600 mt-1 text-sm font-medium">
            ¡Bienvenido! Ingresa para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col space-y-5">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
            error={emailError}
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            error={passwordError}
          />

          <Button
            type="submit"
            gradient={true}
            className="w-full py-2 rounded-lg font-bold shadow-md"
          >
            Ingresar
          </Button>
        </form>

        {generalError && (
          <p className="mt-4 text-red-600 font-medium bg-red-50 py-1 rounded">
            {generalError}
          </p>
        )}

        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg text-left">
          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-2">
            Credenciales de demostración
          </p>
          <div className="space-y-1 text-sm text-gray-700">
            <p><span className="font-semibold">Admin:</span> admin@demo.com / admin123</p>
            <p><span className="font-semibold">Vendedor:</span> vendedor@demo.com / vend123</p>
          </div>
        </div>
      </div>
    </div>
  );
}