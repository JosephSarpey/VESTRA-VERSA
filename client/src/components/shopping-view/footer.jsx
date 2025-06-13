import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold">VESTRA VERSA</h2>
          <p className="mt-2 text-sm text-gray-400">
            Shop smart. Shop Fast. Your favorite online store.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop/listing" className="hover:underline">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/shop/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <a
              href="https://wa.me/+233507513019"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-green-500"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-500"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-500"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-blue-400"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-10 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} VESTRA VERSA. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
