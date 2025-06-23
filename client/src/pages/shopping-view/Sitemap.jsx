import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../constants/navigation';
import { FaHome, FaStore, FaInfoCircle, FaEnvelope, FaUserShield, FaFileAlt } from 'react-icons/fa';

const linkIcons = {
  '/': <FaHome className="inline mr-2 text-blue-500" />,
  '/shop/listing': <FaStore className="inline mr-2 text-green-500" />,
  '/shop/contact': <FaEnvelope className="inline mr-2 text-amber-500" />,
  '/shop/about': <FaInfoCircle className="inline mr-2 text-purple-500" />,
  '/privacy-policy': <FaUserShield className="inline mr-2 text-gray-500" />,
  '/terms': <FaFileAlt className="inline mr-2 text-gray-500" />,
};

const linkGroups = [
  {
    heading: 'Main Pages',
    links: ['/', '/shop/listing', '/shop/about', '/shop/contact'],
  },
  {
    heading: 'Legal',
    links: ['/privacy-policy', '/terms'],
  },
];

const Sitemap = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-2">Sitemap</h1>
    <p className="mb-8 text-gray-600">
      Find all the main sections and important pages of VESTRA VERSA at a glance.
    </p>
    <div className="space-y-8">
      {linkGroups.map(group => (
        <div key={group.heading}>
          <h2 className="text-xl font-semibold mb-4">{group.heading}</h2>
          <ul className="space-y-3">
            {group.links.map(path => {
              const link = NAV_LINKS.find(l => l.path === path);
              if (!link) return null;
              return (
                <li key={link.path}>
                  <Link to={link.path} className="flex items-center text-blue-700 hover:underline text-lg">
                    {linkIcons[link.path] || null}
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default Sitemap;