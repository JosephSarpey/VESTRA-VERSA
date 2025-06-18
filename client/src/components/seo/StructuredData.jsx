import { useEffect } from 'react';
import { COMPANY_INFO } from '../../constants/navigation';

export const StructuredData = () => {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: COMPANY_INFO.name,
      description: COMPANY_INFO.description,
      url: window.location.origin,
      address: {
        '@type': 'PostalAddress',
        streetAddress: COMPANY_INFO.address,
        addressLocality: 'Accra',
        addressRegion: 'Greater Accra',
        addressCountry: 'GH',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: COMPANY_INFO.phone,
        contactType: 'customer service',
        email: COMPANY_INFO.email,
        areaServed: 'GH',
        availableLanguage: 'en',
      },
      sameAs: [
        'https://facebook.com',
        'https://twitter.com',
        'https://instagram.com',
      ],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ],
          opens: '09:00',
          closes: '18:00',
        },
      ],
    };

    script.text = JSON.stringify(structuredData);
    
    // Add script to document head
    document.head.appendChild(script);
    
    // Cleanup function to remove script on unmount
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
};

export default StructuredData;
