function DarciaThemeServices() {
  const services = [
    {
      title: 'Excellent food',
      description:
        'We offer our clients excellent quality services for many years, with the best and delicious food in the city.',
      icon: (
        <svg
          className="w-24 h-24 text-[#4CAF50] stroke-[1.5]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-8 12a8 8 0 0 1 16 0M4 20c0-2.8 2.2-5 5-5s5 2.2 5 5"
          />
        </svg>
      ),
    },
    {
      title: 'Fast food',
      description:
        'We offer our clients excellent quality services for many years, with the best and delicious food in the city.',
      icon: (
        <svg
          className="w-24 h-24 text-[#4CAF50] stroke-[1.5]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm-9 0h.01M18 12h.01"
          />
        </svg>
      ),
    },
    {
      title: 'Delivery',
      description:
        'We offer our clients excellent quality services for many years, with the best and delicious food in the city.',
      icon: (
        <svg
          className="w-24 h-24 text-[#4CAF50] stroke-[1.5]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1m8-1a1 1 0 0 1-1 1H9m4-1V8a1 1 0 0 1 1-1h2.586a1 1 0 0 1 .707.293l3.414 3.414a1 1 0 0 1 .293.707V16a1 1 0 0 1-1 1h-1m-6-1a1 1 0 0 0 1 1h1M5 17a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m6 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="">
      {/* Services Section */}
      <div className="container mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <p className="text-[#4CAF50] text-xl mb-4">Offering</p>
          <h2 className="text-white text-5xl font-bold">
            Our amazing services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-8">{service.icon}</div>
              <h3 className="text-white text-2xl font-bold mb-6">
                {service.title}
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-sm mx-auto">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DarciaThemeServices;
