import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../../constants/navigation';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="prose prose-indigo mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="mt-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-600">
              Welcome to {COMPANY_INFO.name}. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
            <p className="text-gray-600">
              We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
              <li>Identity Data (name, username, or similar identifier)</li>
              <li>Contact Data (billing address, delivery address, email address, and telephone numbers)</li>
              <li>Financial Data (payment card details)</li>
              <li>Transaction Data (details about payments to and from you and other details of products you have purchased from us)</li>
              <li>Technical Data (internet protocol (IP) address, browser type and version, time zone setting and location)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Data</h2>
            <p className="text-gray-600">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
              <li>To process and deliver your order</li>
              <li>To manage our relationship with you</li>
              <li>To improve our website, products/services, and customer relationships</li>
              <li>To administer and protect our business and this website</li>
              <li>To deliver relevant website content and advertisements to you</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
            <p className="text-gray-600">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
              used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those 
              employees, agents, contractors, and other third parties who have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Your Legal Rights</h2>
            <p className="text-gray-600">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, 
              including the right to request access, correction, erasure, restriction, transfer, or to withdraw consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
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
