// src/contexts/CartContext.jsx
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

const CartContext = createContext({
  cartItems: [],
  addToCart: (productData) => console.warn('addToCart function not yet initialized', productData),
  removeFromCart: (identifier) => console.warn('removeFromCart function not yet initialized', identifier),
  increaseQuantity: (identifier) => console.warn('increaseQuantity function not yet initialized', identifier),
  decreaseQuantity: (identifier) => console.warn('decreaseQuantity function not yet initialized', identifier),
  clearCart: () => console.warn('clearCart function not yet initialized'),
  cartTotal: 0,
  cartItemCount: 0,
});

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider. Make sure your App is wrapped in CartProvider.');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('auraCartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error parsing cartItems from localStorage:", error);
      localStorage.removeItem('auraCartItems');
      return []; 
    }
  });

  useEffect(() => {
    localStorage.setItem('auraCartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (productToAdd) => {
    // Валидация остается без изменений
    if (!productToAdd || (!productToAdd._id && !productToAdd.customId)) {
        console.error("CartContext addToCart: Продукт не имеет _id или customId.", productToAdd);
        alert("Ошибка: Невозможно добавить товар: отсутствует валидный идентификатор.");
        return;
    }
    if (typeof productToAdd.priceValue !== 'number' || isNaN(productToAdd.priceValue)) {
        console.error("CartContext addToCart: У продукта отсутствует или некорректное priceValue.", productToAdd);
        alert("Ошибка: Невозможно добавить товар: некорректная цена.");
        return; 
    }

    setCartItems(prevItems => {
      // ID для варианта в корзине. Теперь он всегда будет `productToAdd.cartItemId`,
      // так как мы формируем его на странице товара.
      const cartItemId = productToAdd.cartItemId || `${productToAdd.customId}-${productToAdd.selectedColor}-${productToAdd.selectedMemory}`;
      
      const existingItemIndex = prevItems.findIndex(item => item.cartItemId === cartItemId);

      if (existingItemIndex > -1) {
        // Товар уже в корзине, увеличиваем количество
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += (productToAdd.quantity || 1);
        return updatedItems;
      } else {
        // Новый товар, добавляем в корзину
        return [...prevItems, { 
            _id: productToAdd._id,
            customId: productToAdd.customId,
            // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
            // Сохраняем полное имя как строку и оригинальную цену
            name: productToAdd.name, // Теперь это уже готовая строка
            originalPriceValue: productToAdd.originalPriceValue, // Сохраняем оригинальную цену
            // --- КОНЕЦ ИЗМЕНЕНИЯ ---
            imageUrl: productToAdd.imageUrl || '/images/placeholder.png',
            priceValue: productToAdd.priceValue,
            productLink: productToAdd.productLink,
            quantity: productToAdd.quantity || 1,
            cartItemId: cartItemId,
        }]; 
      }
    });
  };

  const removeFromCart = (cartItemIdToRemove) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemIdToRemove));
  };

  const increaseQuantity = (cartItemIdToIncrease) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartItemId === cartItemIdToIncrease ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  
  const decreaseQuantity = (cartItemIdToDecrease) => {
    setCartItems(prevItems => {
      const itemToDecreaseIndex = prevItems.findIndex(item => item.cartItemId === cartItemIdToDecrease);
      if (itemToDecreaseIndex === -1) return prevItems;
      const itemToDecrease = prevItems[itemToDecreaseIndex];
      if (itemToDecrease.quantity === 1) {
        return prevItems.filter((_, index) => index !== itemToDecreaseIndex);
      } else {
        const updatedItems = [...prevItems];
        updatedItems[itemToDecreaseIndex] = { ...itemToDecrease, quantity: itemToDecrease.quantity - 1 };
        return updatedItems;
      }
    });
  };

  const clearCart = () => { 
    setCartItems([]);
    localStorage.removeItem('auraCartItems'); 
  };

  const cartTotal = useMemo(() => cartItems.reduce((total, item) => total + ((Number(item.priceValue) || 0) * (Number(item.quantity) || 0)), 0), [cartItems]);
  const cartItemCount = useMemo(() => cartItems.reduce((count, item) => count + (Number(item.quantity) || 0), 0), [cartItems]);

  // --- НОВЫЙ БЛОК ---
  // Добавляем логику расчета стоимости доставки
  const shippingPrice = useMemo(() => {
    // Если сумма заказа больше 5000, доставка бесплатна, иначе 599.
    // Вы можете поменять эту логику как угодно.
    return cartTotal > 5000 ? 0 : 599;
  }, [cartTotal]);

  const value = {
    cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity,
    clearCart, cartTotal, cartItemCount,
    shippingPrice, // <-- Добавляем в value
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};