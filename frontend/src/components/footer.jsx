const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span className="font-bold text-indigo-600">School Management System (SMS)</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex gap-6">
          <span className="hover:text-indigo-600 cursor-help">Help Center</span>
          <span className="hover:text-indigo-600 cursor-help">Terms</span>
          <span className="hover:text-indigo-600 cursor-help">Privacy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
