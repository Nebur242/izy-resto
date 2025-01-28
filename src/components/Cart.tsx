import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <ShoppingCart className="mr-2" /> Cart
        </h3>
        <span className="text-lg font-bold">${total.toFixed(3)}</span>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {cart.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 border-b"
          >
            <div className="flex-1">
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-600">
                ${item.price} × {item.quantity}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Minus size={16} />
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-1 hover:bg-gray-100 rounded text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => alert('Checkout functionality would go here!')}
        className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
      >
        Checkout (${total})
      </button>
    </div>
  );
}
