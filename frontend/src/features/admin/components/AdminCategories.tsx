import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { CategoryForm } from '../../products/components/CategoryForm';
import { getCategories, deleteCategory, updateCategory } from '../../products/services/category.service';
import { Tag, Pencil, Search, Plus, Power, PowerOff } from 'lucide-react';

interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

interface AdminCategoriesProps {
  onCategoryChanged?: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({ onCategoryChanged }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToToggle, setCategoryToToggle] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories(true);
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter(category =>
    category.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleToggleActive = (category: Category) => {
    setCategoryToToggle(category);
    setIsDeleteModalOpen(true);
  };

  const confirmToggleActive = async () => {
    if (!categoryToToggle) return;
    
    try {
      if (categoryToToggle.activo) {
        await deleteCategory(categoryToToggle.id);
      } else {
        await updateCategory(categoryToToggle.id, { activo: true });
      }
      fetchCategories();
      onCategoryChanged?.();
      setIsDeleteModalOpen(false);
      setCategoryToToggle(null);
    } catch (err) {
      console.error('Error toggling category:', err);
      setError('Error al cambiar el estado de la categoría');
    }
  };

  const handleCategorySaved = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    fetchCategories();
    onCategoryChanged?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Categorías</h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar categorías..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando categorías...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchCategories}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p>No se encontraron categorías</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(category => (
                <tr key={category.id} className={`bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!category.activo ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{category.nombre}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{category.descripcion || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${category.activo ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
                      {category.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(category)}
                        className={category.activo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                        title={category.activo ? 'Desactivar' : 'Activar'}
                      >
                        {category.activo ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <CategoryForm
          category={editingCategory}
          onCategorySaved={handleCategorySaved}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryToToggle(null);
        }}
        title={categoryToToggle?.activo ? 'Desactivar Categoría' : 'Activar Categoría'}
      >
        <div className="text-center">
          <p className="mb-4">
            {categoryToToggle?.activo
              ? <>¿Deseas <strong>desactivar</strong> la categoría "{categoryToToggle?.nombre}"?</>
              : <>¿Deseas <strong>reactivar</strong> la categoría "{categoryToToggle?.nombre}"?</>
            }
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {categoryToToggle?.activo
              ? 'La categoría dejará de aparecer en el menú y en los filtros. Los productos que la usan no se verán afectados.'
              : 'La categoría volverá a estar disponible en el menú y los filtros.'
            }
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCategoryToToggle(null);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={confirmToggleActive}
              className={`px-4 py-2 text-white rounded-lg ${categoryToToggle?.activo ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {categoryToToggle?.activo ? 'Desactivar' : 'Reactivar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
