const DarciaThemeHero = () => {
  return (
    <div className="container mx-auto px-8 py-16 flex flex-col-reverse md:flex-row items-center justify-between">
      <div className="text-center md:text-left max-w-xl">
        <h1 className="text-[#4CAF50] text-4xl md:text-6xl font-bold mb-4 md:mb-6">
          Resto food
        </h1>
        <h2 className="text-white text-3xl md:text-5xl font-bold leading-snug md:leading-tight mb-6 md:mb-8">
          Try the best food of
          <br />
          the week.
        </h2>
        <button className="bg-[#4CAF50] text-white px-6 md:px-8 py-3 rounded-lg text-base md:text-lg font-medium hover:bg-[#45a049] transition-colors">
          View Menu
        </button>
      </div>

      <div className="relative mb-8 md:mb-0">
        <img
          src="https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=684&q=80"
          alt="Fresh salad in a black plate"
          className="w-64 h-64 md:w-[500px] md:h-[500px] object-cover rounded-full mx-auto md:mx-0"
        />
      </div>
    </div>
  );
};

export default DarciaThemeHero;
