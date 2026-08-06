import React, { useState, useEffect } from 'react';
import { Input, Button } from '../../../shared/components/iu';
import { createCategory, updateCategory } from '../services/category.service';
import type { Category } from '../types/category.types';

interface CategoryFormProps {
  category?: Category | null;
  onCategorySaved: () => void;
  onCancel?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ category, onCategorySaved, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isEditing = !!category;

  useEffect(() => {
    if (category) {
      setNombre(category.nombre || '');
      setDescripcion(category.descripcion || '');
    } else {
      resetForm();
    }
  }, [category]);

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nombre.trim()) {
      setError('El nombre de la categoría es requerido');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await updateCategory(category!.id, {
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || undefined,
        });
        setSuccess('Categoría actualizada exitosamente');
      } else {
        await createCategory({
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || undefined,
        });
        setSuccess('Categoría creada exitosamente');
        resetForm();
      }
      onCategorySaved();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar la categoría';
      if (message.includes('duplicate key') || message.includes('ya existe')) {
        setError('Ya existe una categoría con ese nombre');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {isEditing ? 'Editar Categoría' : 'Agregar Categoría'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la categoría"
          required
        />

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción de la categoría"
            rows={3}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm bg-green-50 px-3 py-2 rounded">{success}</p>
        )}

        <div className="flex gap-2">
          <Button
            type="submit"
            gradient={true}
            disabled={loading}
            className="flex-1 py-2 rounded-lg font-bold shadow-md"
          >
            {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
          </Button>
          {isEditing && onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="py-2 rounded-lg font-medium"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};