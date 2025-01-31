export default function Footer() {
  return (
    <section className="bg-[#1a1a1a] py-20 relative">
      <div className="absolute top-[250px] right-0 w-[100px] h-[120px] bg-[url('https://radiustheme.com/demo/wordpress/themes/panpie/wp-content/themes/panpie/assets/element/footer_shape03.png')] bg-no-repeat bg-cover hidden sm:block"></div>
      <div className="absolute top-[310px] left-[-50px] w-[170px] h-[150px] bg-[url('https://radiustheme.com/demo/wordpress/themes/panpie/wp-content/themes/panpie/assets/element/footer_shape01.png')] bg-no-repeat bg-cover hidden sm:block"></div>
      <div className="flex flex-wrap items-start justify-center sm:justify-around text-center sm:text-start px-6 sm:px-12 lg:px-20 gap-10 sm:gap-20 relative">
        <div className="absolute top-0 right-[30%] w-[170px] h-[150px] bg-[url('https://radiustheme.com/demo/wordpress/themes/panpie/wp-content/themes/panpie/assets/element/footer_shape02.png')] bg-no-repeat bg-cover hidden sm:block"></div>
        <div className="w-full sm:w-auto">
          <img
            src="https://radiustheme.com/demo/wordpress/themes/panpie/wp-content/uploads/2021/03/logo2.png"
            alt="Pample Logo"
            className="mb-4 mx-auto sm:mx-0"
            width={250}
            height={100}
          />
          <p className="text-white mb-4 max-w-xs">
            128 6th Ave, New York, NY 10015 United States, Dcca-1212
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <h2 className="text-xl font-bold mb-2 text-white">Hot Menu</h2>
          <ul className="text-gray-600">
            {[
              'Monday: 10.00am - 05.00pm',
              'Tuesday: 10.20am - 05.30pm',
              'Wednesday: 10.30am - 05.60pm',
              'Thursday: 11.00am - 07.10pm',
              'Friday: Closed',
            ].map((item, index) => (
              <li key={index} className="text-white py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full sm:w-auto">
          <h2 className="text-xl font-bold mb-2 text-white">Opening Hours</h2>
          <ul className="text-gray-600">
            {[
              'Monday: 10.00am - 05.00pm',
              'Tuesday: 10.20am - 05.30pm',
              'Wednesday: 10.30am - 05.60pm',
              'Thursday: 11.00am - 07.10pm',
              <span key="friday" className="text-[#fcb302]">
                Friday: Closed
              </span>,
            ].map((item, index) => (
              <li key={index} className="text-white py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-10 text-center text-white px-4">
        <p>&copy; 2025 Pample. All Rights Reserved by RadiusTheme</p>
      </div>
    </section>
  );
}
