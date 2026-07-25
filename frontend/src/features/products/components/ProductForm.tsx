import React, { useState, useEffect, useRef } from 'react';
import { Input, Button } from '../../../shared/components/iu';
import { useCategories } from '../hooks/useCategories';
import { createProduct, updateProduct } from '../services/product.service';
import { apiClient } from '../../../shared/utils/apiClient';
import type { CreateProductPayload } from '../types/product.types';
import { Image, X } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('0');
  const [categoriaId, setCategoriaId] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [activo, setActivo] = useState(true);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten archivos JPEG, PNG o WEBP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no debe superar los 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const result = await apiClient.upload<{ imageUrl: string }>('/api/upload', formData);
      setImgUrl(result.imageUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al subir la imagen';
      setError(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setImgUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
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

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Imagen del producto
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {imgUrl ? (
            <div className="relative">
              <img
                src={imgUrl}
                alt="Vista previa"
                className="w-full h-40 object-contain rounded-md border border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                }}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-40 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center gap-2 hover:border-orange-500 hover:bg-orange-50 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                  <span className="text-sm text-gray-500">Subiendo imagen...</span>
                </>
              ) : (
                <>
                  <Image className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Seleccionar imagen</span>
                  <span className="text-xs text-gray-400">JPEG, PNG o WEBP (máx. 5MB)</span>
                </>
              )}
            </button>
          )}
        </div>

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
            disabled={loading || uploading}
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
