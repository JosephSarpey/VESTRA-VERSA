/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/vv_logo.jpg"; // Using your existing logo import
import { FaGem, FaLightbulb, FaLeaf, FaHandshake } from "react-icons/fa";
import Footer from "@/components/shopping-view/footer";

const brandValues = [
  {
    title: "Quality",
    description: "We use only the finest materials to ensure every piece is crafted to perfection.",
    icon: <FaGem className="text-4xl mb-3 text-amber-600" />,
  },
  {
    title: "Innovation",
    description: "Our designs blend timeless elegance with modern trends.",
    icon: <FaLightbulb className="text-4xl mb-3 text-yellow-500" />,
  },
  {
    title: "Sustainability",
    description: "We are committed to ethical sourcing and eco-friendly practices.",
    icon: <FaLeaf className="text-4xl mb-3 text-green-600" />,
  },
  {
    title: "Customer Focus",
    description: "Your satisfaction inspires everything we do.",
    icon: <FaHandshake className="text-4xl mb-3 text-blue-600" />,
  },
];

const testimonials = [
  {
    name: "Priya S.",
    text: "The quality and fit are unmatched. I always get compliments when I wear VESTRA VERSA!",
  },
  {
    name: "Daniel M.",
    text: "Finally, a brand that cares about both style and sustainability.",
  },
  {
    name: "Amina R.",
    text: "Exceptional customer service and beautiful designs. Highly recommended!",
  },
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
              <div className="mt-8 flex justify-center">
                <img
                  src={logo}
                  alt="VESTRA VERSA Logo"
                  className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-amber-500 p-1"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Brand Values Section */}
        <motion.section
          className="py-16 bg-white"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Brand Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {brandValues.map((value, idx) => (
                <motion.div
                  key={value.title}
                  className="flex flex-col items-center bg-gray-100 rounded-xl p-6 shadow hover:shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <span className="text-4xl mb-3">{value.icon}</span>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-center">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Our Mission Section */}
        <motion.section
          className="py-16 bg-gradient-to-r from-amber-400 to-amber-300"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <motion.p
              className="text-lg md:text-xl text-gray-800 font-medium"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              viewport={{ once: true }}
            >
              At VESTRA VERSA, our mission is to empower self-expression through premium, stylish, and sustainable fashion. We believe in making every customer feel confident and unique.
            </motion.p>
          </div>
        </motion.section>

        {/* Customer Testimonials Section */}
        <motion.section
          className="py-16 bg-white"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.name}
                  className="bg-amber-100 rounded-xl p-6 shadow hover:shadow-lg flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <p className="text-gray-800 text-center mb-4 italic">"{testimonial.text}"</p>
                  <span className="font-semibold text-amber-700">{testimonial.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}