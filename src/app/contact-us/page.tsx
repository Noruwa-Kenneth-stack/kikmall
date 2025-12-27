"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Footerheader from "@/components/Footer-header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Mail,
  Phone,
  Send,
  CheckCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const pathname = usePathname();
const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    store: "",
    location: "",
    subject: "",
    message: "",
    type: "general", // general, brand, retailer, press, other
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending (replace with real endpoint later)
    await new Promise((resolve) => setTimeout(resolve, 1800));

    setIsSubmitting(false);
    setSubmitted(true);

    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours",
    });

    // Optional: send to your backend / email service
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  

  // Extract search params string to a variable
  const searchParamsString = searchParams?.toString() ?? "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash; // includes the #
    if (!hash) return;

    const element = document.querySelector(hash);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [pathname, searchParamsString]); // clean dependency array


  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-8" />
          <h1 className="text-4xl font-bold text-[#002551] mb-4">
            Thank you, {formData.name.split(" ")[0] || "there"}!
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Your message has been sent successfully.
            <br />
            We’ll reply to <strong>{formData.email}</strong> within 24 hours.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: "",
                email: "",
                phone: "",
                store: "",
                location: "",
                subject: "",
                message: "",
                type: "general",
              });
            }}
            size="lg"
            className="bg-[#002551] hover:bg-[#003d80]"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#031b34]/90 border-b border-white/10 sticky top-0 z-50">
        <Footerheader />
      </header>

      {/* HERO */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/08/Hero-Mock-scaled.jpg"
            alt="Contact background"
            fill
            className="object-cover brightness-[0.4]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Let’s Talk
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Whether you&apos;re a brand, retailer, or just curious — we’d love to hear from you.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-20 px-6 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* CONTACT FORM */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12" id="send-message">
            <h2 className="text-3xl font-bold text-[#002551] mb-8">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+234 801 234 5678"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="type">I am a...</Label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#002551]"
                  >
                    <option value="general">Just curious</option>
                    <option value="brand">Brand / Manufacturer</option>
                    <option value="retailer">Retailer / Store Owner</option>
                    <option value="press">Press / Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

               <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="store">Store Name (optional)</Label>
                  <Input
                    id="store"
                    name="store"
                    type="text"
                    placeholder="Bright grocery store"
                    value={formData.store}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Location </Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Ikeja, Island"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This is requred for Ads and Promotions.
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  required
                  placeholder="e.g. Partnership inquiry, Demo request, Support"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="message">Your Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Tell us how we can help you..."
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-2 resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-[#002551] hover:bg-[#003d80] text-lg font-medium py-7"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-3 h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* CONTACT INFO + MAP */}
          <div className="space-y-12">
            {/* Quick Contact Cards */}
            <div className="grid gap-6 md:grid-cols-1">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-2xl shadow-lg">
                <Mail className="w-10 h-10 mb-4" />
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-orange-100 mb-4">We reply within a few hours</p>
                <a href="mailto:hello@kik.africa" className="text-2xl font-bold hover:underline">
                  hello@kik.africa
                </a>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-2xl shadow-lg">
                <Phone className="w-10 h-10 mb-4" />
                <h3 className="text-xl font-bold mb-2">Call or WhatsApp</h3>
                <p className="text-blue-100 mb-4">Mon–Fri, 9am–6pm WAT</p>
                <a href="tel:+2349010008988" className="text-2xl font-bold hover:underline">
                  +234 901 000 8988
                </a>
              </div>
            </div>

            {/* Fun CTA */}
            <div className="bg-[#002551] text-white p-10 rounded-3xl text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
              <h3 className="text-2xl font-bold mb-4">Want a demo?</h3>
              <p className="text-lg mb-8 opacity-90">
                See Kik in action — book a 15-minute call with our team
              </p>
              <Button size="lg" variant="secondary" className="text-[#002551]">
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}