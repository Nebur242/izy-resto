const DarciaThemeContact = () => {
  return (
    <div className="container mx-auto px-8 py-20">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="max-w-2xl mb-8 md:mb-0">
          <p className="text-[#4CAF50] text-xl mb-4">Let's talk</p>
          <h2 className="text-white text-5xl font-bold mb-6">Contact us</h2>
          <p className="text-gray-400 text-xl leading-relaxed">
            If you want to reserve a table in our restaurant, contact us and we
            will attend you quickly, with our 24/7 chat service.
          </p>
        </div>
        <div>
          <button className="bg-[#4CAF50] text-white text-md px-6 py-4 rounded-xl hover:bg-[#45a049]">
            Contact us now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DarciaThemeContact;
