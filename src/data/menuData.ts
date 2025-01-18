import { MenuData } from '../types';

export const menuData: MenuData = {
  mainDishes: [
    {
      id: 'grilled-salmon',
      name: 'Grilled Salmon',
      description: 'Fresh salmon fillet seasoned with herbs and grilled to perfection, served with a side of roasted vegetables and lemon-butter sauce.',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=500',
      category: 'main'
    },
    {
      id: 'vegetable-pad-thai',
      name: 'Vegetable Pad Thai',
      description: 'Stir-fried rice noodles with a medley of fresh vegetables, tofu, bean sprouts, and peanuts, tossed in a tangy tamarind sauce.',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80&w=500',
      category: 'main'
    },
    {
      id: 'mushroom-risotto',
      name: 'Mushroom Risotto',
      description: 'Creamy rice cooked with savory mushrooms, garlic, shallots, and Parmesan cheese, finished with a drizzle of truffle oil and fresh parsley.',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=500',
      category: 'main'
    },
    {
      id: 'grilled-chicken',
      name: 'Grilled Chicken',
      description: 'Grilled chicken breast served atop crisp lettuce, tossed with dressing, shaved cheese, garlic croutons, and cherry tomatoes.',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=500',
      category: 'main'
    },
    {
      id: 'classic-beef',
      name: 'Classic Beef',
      description: 'Layers of rich tomato sauce, seasoned ground beef, lasagna noodles smothered in creamy bechamel sauce, baked to bubbly perfection.',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=500',
      category: 'main'
    },
    {
      id: 'eggplant-parmesan',
      name: 'Eggplant Parmesan',
      description: 'Slices of breaded eggplant, fried to a golden crisp, layered with marinara sauce, melted Parmesan cheese, then baked until bubbly.',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?auto=format&fit=crop&q=80&w=500',
      category: 'main'
    }
  ],
  beverages: [
    {
      id: 'classic-margarita',
      name: 'Classic Margarita',
      description: 'Traditional margarita with fresh lime juice',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1486428263684-28ec9e4f2584?auto=format&fit=crop&q=80&w=500',
      category: 'beverage'
    },
    {
      id: 'mango-mocktail',
      name: 'Mango Mocktail',
      description: 'Refreshing mango-based non-alcoholic drink',
      price: 2.99,
      image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&q=80&w=500',
      category: 'beverage'
    }
  ],
  desserts: [
    {
      id: 'chocolate-mousse',
      name: 'Chocolate Mousse',
      description: 'Rich and creamy chocolate mousse',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1511715112108-9acc6c3ff61f?auto=format&fit=crop&q=80&w=500',
      category: 'dessert'
    },
    {
      id: 'tiramisu',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=500',
      category: 'dessert'
    }
  ]
};