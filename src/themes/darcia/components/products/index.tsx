function DarciaThemeProducts() {
  const menuItems = [
    {
      title: 'Barbecue salad',
      description: 'Delicious dish',
      price: 22.0,
      image:
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=384&q=80',
    },
    {
      title: 'Salad with fish',
      description: 'Delicious dish',
      price: 12.0,
      image:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=384&q=80',
    },
    {
      title: 'Spinach salad',
      description: 'Delicious dish',
      price: 9.5,
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=384&q=80',
    },
    {
      title: 'Barbecue salad',
      description: 'Delicious dish',
      price: 22.0,
      image:
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=384&q=80',
    },
    {
      title: 'Salad with fish',
      description: 'Delicious dish',
      price: 12.0,
      image:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=384&q=80',
    },
    {
      title: 'Spinach salad',
      description: 'Delicious dish',
      price: 9.5,
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=384&q=80',
    },
  ];

  return (
    <div className="min-h-screen  font-sans py-20">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <p className="text-[#4CAF50] text-xl mb-4">Special</p>
          <h2 className="text-white text-5xl font-bold">Menu of the week</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="bg-[#243028] rounded-2xl p-6 flex flex-col items-center"
            >
              <div className="mb-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-48 h-48 rounded-full object-cover"
                />
              </div>
              <h3 className="text-white text-2xl font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 mb-4">{item.description}</p>
              <div className="flex items-center justify-between w-full">
                <span className="text-white text-2xl font-bold">
                  ${item.price.toFixed(2)}
                </span>
                <button className="bg-[#4CAF50] p-3 rounded-lg hover:bg-[#45a049] transition-colors">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DarciaThemeProducts;
