import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaWhatsapp } from 'react-icons/fa';
import Footer from "@/components/shopping-view/footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-black text-white min-h-screen flex flex-col">
      <div className="max-w-4xl mx-auto px-4 py-12 flex-1">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-amber-500 drop-shadow">
          Contact Us
        </h1>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form Card */}
          <div className="bg-white text-gray-900 rounded-xl shadow-lg border-t-4 border-amber-500 p-8">
            <h2 className="text-2xl font-semibold mb-6 text-amber-600">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-800">Name</label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-gray-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-800">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="bg-gray-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1 text-gray-800">Subject</label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="bg-gray-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1 text-gray-800">Message</label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  className="bg-gray-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Info Card */}
          <div className="bg-white text-gray-900 rounded-xl shadow-lg border-t-4 border-amber-500 p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-amber-600">Contact Information</h2>
              <p className="mb-6 text-gray-700">
                Have questions or feedback? We'd love to hear from you! Fill out the form or reach out to us using the contact details below.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-amber-500" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-sm text-gray-600">Main Street, 10801, New Rochelle, New York, NY, USA</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-amber-500" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <a href="mailto:vestraversa@gmail.com" className="text-sm text-gray-600 hover:underline">vestraversa@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-amber-500" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <a href="tel:+1 (914) 569-5621" className="text-sm text-gray-600 hover:underline">+1 (914) 569-5621</a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaWhatsapp className="h-5 w-5 text-amber-500" />
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <a href="https://wa.me/19145695621" className="text-sm text-gray-600 hover:underline">Reach Us on WhatsApp</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-medium mb-3 text-gray-800">Business Hours</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}