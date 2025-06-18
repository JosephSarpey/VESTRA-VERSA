import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../../constants/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const teamMembers = [
  {
    name: 'Ebenezer Amakeh',
    role: 'Founder & CEO',
    bio: 'John has over 10 years of experience in the fashion industry and a passion for sustainable clothing.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
  },
  {
    name: 'Jane Smith',
    role: 'Head of Design',
    bio: 'Jane leads our design team with a keen eye for modern aesthetics and sustainable materials.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80'
  },
  {
    name: 'Michael Johnson',
    role: 'Operations Manager',
    bio: 'Michael ensures our operations run smoothly while maintaining our commitment to ethical practices.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
  }
];

const values = [
  {
    title: 'Sustainability',
    description: 'We are committed to eco-friendly practices throughout our supply chain and products.'
  },
  {
    title: 'Quality',
    description: 'Every piece is crafted with attention to detail and made to last.'
  },
  {
    title: 'Innovation',
    description: 'We continuously explore new materials and techniques to improve our products.'
  },
  {
    title: 'Community',
    description: 'We believe in giving back and supporting the communities we work with.'
  }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Our Story
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Crafting premium fashion with a commitment to excellence and style.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-amber-600 font-semibold tracking-wide uppercase">About Us</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                A better way to experience fashion
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Founded in {new Date().getFullYear() - 5}, {COMPANY_INFO.name} was born from a simple idea: fashion should be 
                sustainable, high-quality, and accessible to everyone. What started as a small boutique has grown into a 
                beloved brand known for its commitment to ethical practices and timeless designs.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-base text-amber-600 font-semibold tracking-wide uppercase">Our Values</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                What we stand for
              </p>
            </div>
            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((value, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900">{value.title}</h3>
                    <p className="mt-2 text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-base text-amber-600 font-semibold tracking-wide uppercase">Our Team</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                The people behind the brand
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img 
                    className="h-64 w-full object-cover" 
                    src={member.image} 
                    alt={member.name} 
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-amber-600">{member.role}</p>
                    <p className="mt-2 text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to explore our collection?</span>
              <span className="block text-amber-200">Start shopping today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Button
                  asChild
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
                >
                  <Link to="/shop/listing">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
