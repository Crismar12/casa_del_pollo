import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from './Modal';
import { UserForm } from './UserForm';
import { authService } from '../../auth/services/auth.service';
import { Users, Pencil, Power, PowerOff, Search, Plus } from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';
import type { Usuario } from '../../../shared/types/usuario.types';

export const AdminUsers: React.FC = () => {
  const { usuario: currentUser } = useAuth();
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<Usuario | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authService.getUsers(searchTerm || undefined);
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (user: Usuario) => {
    setEditingUser(user);
    setIsEditOpen(true);
  };

  const handleToggleActive = (user: Usuario) => {
    setUserToToggle(user);
    setIsDeactivateOpen(true);
  };

  const confirmToggleActive = async () => {
    if (!userToToggle) return;
    try {
      if (userToToggle.activo) {
        await authService.deactivateUser(userToToggle.idusuario);
      } else {
        await authService.updateUser(userToToggle.idusuario, { activo: true });
      }
      fetchUsers();
      setIsDeactivateOpen(false);
      setUserToToggle(null);
    } catch (err: any) {
      console.error('Error toggling user:', err);
      setError(err?.message || 'Error al cambiar estado del usuario');
    }
  };

  const handleUserSaved = () => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setEditingUser(null);
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Usuarios</h2>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando usuarios...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
          <button onClick={fetchUsers} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Reintentar
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p>No se encontraron usuarios</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.idusuario} className={`bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!user.activo ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{user.nombre}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.rol === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'}`}>
                      {user.rol === 'admin' ? 'Admin' : 'Vendedor'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.activo ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800" title="Editar">
                        <Pencil className="w-4 h-4" />
                      </button>
                      {String(user.idusuario) !== String(currentUser?.idusuario) && (
                        <button
                          onClick={() => handleToggleActive(user)}
                          className={user.activo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                          title={user.activo ? 'Desactivar' : 'Activar'}
                        >
                          {user.activo ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Crear usuario */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nuevo Usuario">
        <UserForm onUserCreated={handleUserSaved} />
      </Modal>

      {/* Editar usuario */}
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setEditingUser(null); }} title="Editar Usuario">
        {editingUser && (
          <EditUserForm
            user={editingUser}
            currentUserId={currentUser?.idusuario}
            onSaved={handleUserSaved}
            onCancel={() => { setIsEditOpen(false); setEditingUser(null); }}
          />
        )}
      </Modal>

      {/* Confirmar desactivar/activar */}
      <Modal isOpen={isDeactivateOpen} onClose={() => { setIsDeactivateOpen(false); setUserToToggle(null); }}
        title={userToToggle?.activo ? 'Desactivar Usuario' : 'Activar Usuario'}>
        <div className="text-center">
          <p className="mb-4">
            {userToToggle?.activo
              ? <>¿Deseas <strong>desactivar</strong> a "{userToToggle?.nombre}"?</>
              : <>¿Deseas <strong>reactivar</strong> a "{userToToggle?.nombre}"?</>
            }
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {userToToggle?.activo
              ? 'El usuario no podrá iniciar sesión, pero sus registros históricos se conservarán.'
              : 'El usuario podrá volver a iniciar sesión normalmente.'
            }
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => { setIsDeactivateOpen(false); setUserToToggle(null); }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancelar
            </button>
            <button onClick={confirmToggleActive}
              className={`px-4 py-2 text-white rounded-lg ${userToToggle?.activo ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
              {userToToggle?.activo ? 'Desactivar' : 'Reactivar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Mini form inside edit modal — avoids needing the full UserForm (which is create-only)
const EditUserForm: React.FC<{ user: Usuario; currentUserId?: string; onSaved: () => void; onCancel: () => void }> = ({ user, currentUserId, onSaved, onCancel }) => {
  const [nombre, setNombre] = useState(user.nombre);
  const [email, setEmail] = useState(user.email);
  const [rol, setRol] = useState(user.rol);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isSelf = String(user.idusuario) === String(currentUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      setError('Nombre y email son requeridos');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const payload: any = { nombre: nombre.trim(), email: email.trim() };
      if (!isSelf) payload.rol = rol;
      await authService.updateUser(user.idusuario, payload);
      onSaved();
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-2 rounded">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
        <input value={nombre} onChange={e => setNombre(e.target.value)}
          className="w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)}
          className="w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol</label>
        <select value={rol} onChange={e => setRol(e.target.value)} disabled={isSelf}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:text-gray-500">
          <option value="vendedor">Vendedor</option>
          <option value="admin">Admin</option>
        </select>
        {isSelf && <p className="text-xs text-amber-600 mt-1">No puedes cambiar tu propio rol por seguridad.</p>}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
          Cancelar
        </button>
        <button type="submit" disabled={submitting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
          {submitting ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};
