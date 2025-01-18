const DarciaThemeFooter = () => {
  return (
    <footer className="bg-white rounded-lg shadow dark:dark:bg-[#1E2923] ">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://flowbite.com/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            {/* <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            /> */}
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Iziresto
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 dark:text-white">
            <li>
              <a
                href="#"
                className="hover:underline me-4 md:me-6  dark:text-white hover:text-green-700"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline me-4 md:me-6  dark:text-white hover:text-green-700"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline me-4 md:me-6 dark:text-white hover:text-green-700"
              >
                Licensing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline dark:text-white hover:text-green-700"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023 Izi . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default DarciaThemeFooter;
