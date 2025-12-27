"use client";
import React, { useState } from 'react';
import Link from 'next/link'; 
import { ShoppingBag, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
  setStatus('success');
  setEmail('');
} else if (res.status === 409) {
  setStatus('error');
  setErrorMsg('Email already subscribed.');
} else {
  setStatus('error');
  setErrorMsg(data.message || 'Subscription failed.');
}
    
    } catch (err) {
      console.error('Network error:', err);
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };




  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <ShoppingBag className="w-8 h-8 text-cyan-500" />
              <span className="ml-2 text-2xl font-bold text-cyan-500">kik</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your ultimate destination for weekly ads, deals, and digital coupons. 
              Save money on everything you need.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-300 hover:text-cyan-500 transition-colors"> FAQ</Link></li>
              <li><Link href="/store-locator" className="text-gray-300 hover:text-cyan-500 transition-colors">Store Locator</Link></li>
              {/* <li><Link href="#" className="text-gray-300 hover:text-cyan-500 transition-colors">Mobile App</Link></li> */}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-300 hover:text-cyan-500 transition-colors">Help Center</Link></li>
              <li><Link href="/contact-us" className="text-gray-300 hover:text-cyan-500 transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-cyan-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-300 hover:text-cyan-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-cyan-500 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-gray-300 text-sm">
              Get the latest deals and discount delivered to your inbox.
            </p>
             <form
              onSubmit={handleSubscribe}
            >
            <div className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-cyan-500 hover:bg-cyan-600">
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </Button>
            </div>
            </form>
             {status === 'success' && (
            <p className="text-green-300 mt-2">Thanks for subscribing! 🎉 Please check your email inbox to confirm.</p>
          )}
          {status === 'error' && (
            <p className="text-red-300 mt-2">{errorMsg}</p>
          )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-cyan-500" />
              <span className="text-gray-300">+234-8169220227</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-cyan-500" />
              <span className="text-gray-300">support@kik.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-cyan-500" />
              <span className="text-gray-300">Lagos, Nigeria</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
      </div>
    </footer>
  );
};

export default Footer;
