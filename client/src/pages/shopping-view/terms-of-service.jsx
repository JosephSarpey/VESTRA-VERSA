import React from 'react';
import { COMPANY_INFO } from '../../constants/navigation';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="prose prose-indigo mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="mt-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-600">
              Welcome to {COMPANY_INFO.name} ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to 
              and use of our website, products, and services (collectively, the "Services").
            </p>
            <p className="mt-4 text-gray-600">
              Please read these Terms carefully before using our Services. By accessing or using our Services, you agree to be 
              bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Account Registration</h2>
            <p className="text-gray-600">
              To access certain features of our Services, you may be required to create an account. When you create an account, 
              you agree to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your password and accept all risks of unauthorized access</li>
              <li>Immediately notify us if you discover or suspect any security breaches</li>
              <li>Take responsibility for all activities that occur under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Orders and Payment</h2>
            <p className="text-gray-600">
              All orders are subject to product availability. We reserve the right to refuse or cancel any order for any reason, 
              including but not limited to product availability, errors in product or pricing information, or problems identified 
              by our credit and fraud avoidance department.
            </p>
            <p className="mt-4 text-gray-600">
              You agree to provide current, complete, and accurate purchase and account information for all purchases made through 
              our Services. You further agree to promptly update account and payment information, including email address, payment 
              method, and payment card expiration date, so that we can complete your transactions and contact you as needed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-600">
              All content included on our Services, including but not limited to text, graphics, logos, images, audio clips, 
              digital downloads, and software, is the property of {COMPANY_INFO.name} or its content suppliers and is protected by 
              international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="mt-4 text-gray-600">
              You may not modify, copy, reproduce, republish, upload, post, transmit, or distribute any content from our Services 
              without our prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-600">
              To the fullest extent permitted by law, {COMPANY_INFO.name} shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or 
              indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
              <li>Your use or inability to use our Services</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any interruption or cessation of transmission to or from our Services</li>
              <li>Any bugs, viruses, or the like that may be transmitted to or through our Services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Changes to These Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these Terms at any time. We will provide notice of any changes by posting the updated 
              Terms on our website and updating the "Last updated" date at the top of these Terms. Your continued use of our 
              Services after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms, please contact us at:
            </p>
            <address className="mt-4 not-italic text-gray-600">
              {COMPANY_INFO.name}<br />
              {COMPANY_INFO.address}<br />
              Email: <a href={`mailto:${COMPANY_INFO.email}`} className="text-indigo-600 hover:underline">{COMPANY_INFO.email}</a><br />
              Phone: <a href={`tel:${COMPANY_INFO.phone.replace(/\D/g, '')}`} className="text-indigo-600 hover:underline">{COMPANY_INFO.phone}</a>
            </address>
          </section>
        </div>
      </div>
    </div>
  );
}
