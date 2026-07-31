import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addProduct, removeProduct } from '../store/cartSlice';
import type { RootState } from '../../../store';
import type { Product } from "../../products/types/product.types";
import { useNotificationContext } from '../../../shared/context/NotificationContext';

export const useCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { showNotification } = useNotificationContext();

  const handleAddProduct = (product: Product, options?: { showCartAction?: boolean; duration?: number }) => {
    dispatch(addProduct(product));
    const showCartAction = options?.showCartAction ?? true;

    if (showCartAction) {
      showNotification(`Producto ${product.name} agregado al carrito!`, 'success', {
        label: 'Ir al carrito',
        onClick: () => navigate('/carrito'),
      });
    } else {
      showNotification(`Producto ${product.name} agregado`, 'success', undefined, options?.duration);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    dispatch(removeProduct(productId));
  };

  const getProductQuantity = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  return {
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    getProductQuantity,
    cartItems,
  };
};
