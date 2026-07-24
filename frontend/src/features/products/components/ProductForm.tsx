import React, { useState, useEffect } from 'react';
import { Input, Button } from '../../../shared/components/iu';
import { useCategories } from '../hooks/useCategories';
import { createProduct, updateProduct } from '../services/product.service';
import type { CreateProductPayload } from '../types/product.types';

interface ProductFormProps {
  product?: {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imageUrl?: string;
    categoria_id?: number | null;
    activo: boolean;
  } | null;
  onProductSaved: () => void;
  onCancel?: () => void;
}

const PLACEHOLDER_IMAGE = "https://buenazo.cronosmedia.glr.pe/original/2020/08/30/5f4c2be6cce5112a0674ccc8.jpg";

export const ProductForm: React.FC<ProductFormProps> = ({ product, onProductSaved, onCancel }) => {
  const { categories, loading: categoriesLoading } = useCategories();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('0');
  const [categoriaId, setCategoriaId] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [activo, setActivo] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setNombre(product.nombre || '');
      setDescripcion(product.descripcion || '');
      setPrecio(product.precio?.toString() || '');
      setStock(product.stock?.toString() || '0');
      setCategoriaId(product.categoria_id?.toString() || '');
      setImgUrl(product.imageUrl || '');
      setActivo(product.activo ?? true);
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setStock('0');
    setCategoriaId('');
    setImgUrl('');
    setActivo(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nombre.trim()) {
      setError('El nombre del producto es requerido');
      return;
    }
    if (!precio || parseFloat(precio) <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    setLoading(true);
    try {
      const payload: CreateProductPayload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        precio: parseFloat(precio),
        imgUrl: imgUrl.trim() || undefined,
        categoria_id: categoriaId ? parseInt(categoriaId) : null,
        stock: parseInt(stock) || 0,
        activo,
      };

      if (isEditing) {
        await updateProduct(product!.id, payload);
        setSuccess('Producto actualizado exitosamente');
      } else {
        await createProduct(payload);
        setSuccess('Producto creado exitosamente');
        resetForm();
      }
      onProductSaved();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar el producto';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {isEditing ? 'Editar Producto' : 'Agregar Producto'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del producto"
          required
        />

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción del producto"
            rows={3}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Precio (S/)"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="0.00"
            required
          />
          <Input
            label="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={categoriesLoading}
          >
            <option value="">Sin categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="URL de imagen"
          type="text"
          value={imgUrl}
          onChange={(e) => setImgUrl(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
        />

        {imgUrl && (
          <div className="mt-2">
            <img
              src={imgUrl}
              alt="Vista previa"
              className="w-full h-40 object-cover rounded-md border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="activo"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="activo" className="text-sm font-medium text-gray-700">
            Producto activo
          </label>
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
            {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Producto'}
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