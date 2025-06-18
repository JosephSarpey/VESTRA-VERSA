import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaChevronUp } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { NAV_LINKS, SOCIAL_LINKS, COMPANY_INFO } from "../../constants/navigation";
import { scrollToTop } from "../../utils/scrollToTop";

function Footer() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic
    console.log('Subscribing with email:', email);
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <footer 
      className="bg-gray-900 text-white pt-12 pb-6 px-4 relative"
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{COMPANY_INFO.name}</h2>
          <p className="text-gray-400">{COMPANY_INFO.description}</p>
          
          <div className="space-y-2 mt-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <FiMapPin className="flex-shrink-0" />
              <span>{COMPANY_INFO.address}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <FiMail className="flex-shrink-0" />
              <a href={`mailto:${COMPANY_INFO.email}`} className="hover:underline">
                {COMPANY_INFO.email}
              </a>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <FiPhone className="flex-shrink-0" />
              <a href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`} className="hover:underline">
                {COMPANY_INFO.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-gray-400 hover:text-white transition-colors ${
                    location.pathname === link.path ? 'text-white font-medium' : ''
                  }`}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-gray-400 mb-4">
            Subscribe to our newsletter for the latest updates and offers.
          </p>
          {isSubscribed ? (
            <div className="bg-green-100 text-green-800 p-3 rounded-md">
              Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label="Email address for newsletter subscription"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = {
                FaFacebook,
                FaInstagram,
                FaTwitter,
                FaWhatsapp,
              }[social.icon];
              
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.name} (opens in new tab)`}
                  className={`text-2xl ${social.color} transition-colors`}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Payment Methods</h4>
            <div className="flex flex-wrap gap-2">
              {['Visa', 'Mastercard', 'PayPal', 'Mobile Money'].map((method) => (
                <span 
                  key={method}
                  className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>{COMPANY_INFO.copyright}</p>
        <div className="mt-2 space-x-4">
          <Link to="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <span>•</span>
          <Link to="/sitemap" className="hover:underline">
            Sitemap
          </Link>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label="Back to top"
      >
        <FaChevronUp />
      </button>
    </footer>
  );
}

export default Footer;
