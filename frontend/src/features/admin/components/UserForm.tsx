import React, { useState } from 'react';
import { Input } from '../../../shared/components/iu';
import { Button } from '../../../shared/components/iu';
import { authService } from '../../auth/services/auth.service';

interface UserFormProps {
  onUserCreated: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ onUserCreated }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('vendedor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nombre || !email || !contrasena) {
      setError('Todos los campos son requeridos');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.register({ nombre, email, contrasena, rol });
      setSuccess(`Usuario "${result.user.nombre}" creado exitosamente`);
      setNombre('');
      setEmail('');
      setContrasena('');
      setRol('vendedor');
      onUserCreated();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear usuario';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/40 p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Agregar Usuario</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre completo"
          required
        />

        <Input
          label="Correo electronico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
          required
        />

        <Input
          label="Contrasena"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="********"
          required
        />

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rol<span className="text-red-500">*</span>
          </label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="vendedor">Vendedor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded">{success}</p>
        )}

        <Button
          type="submit"
          gradient={true}
          disabled={loading}
          className="w-full py-2 rounded-lg font-bold shadow-md dark:shadow-gray-900/40"
        >
          {loading ? 'Creando...' : 'Crear Usuario'}
        </Button>
      </form>
    </div>
  );
};
