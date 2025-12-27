"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Footerheader from "@/components/Footer-header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, X, Copy, Check, MessageCircle, Sparkles } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: "brands" | "retailers";
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [localInput, setLocalInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(localInput), 180);
    return () => clearTimeout(timer);
  }, [localInput]);

  // ALL REAL FAQS — created only once
  const allFaqs = useMemo<FAQItem[]>(() => [
    // === FOR BRANDS ===
    { question: "Who does Kik currently work with?", answer: "Kik collaborates with both emerging and established brands across groceries, electronics, fashion, and household categories. Our platform helps brands reach shoppers looking for deals in their local area.", category: "brands" },
    { question: "Can I integrate my owned and operated properties?", answer: "Yes. Kik allows brands to integrate existing owned content such as digital brochures, promotional graphics, and product listings into their store pages.", category: "brands" },
    { question: "Can you leverage my existing print promotional content?", answer: "Absolutely. If your brand already produces print flyers or promotional catalogs, Kik can digitize and optimize them for mobile users.", category: "brands" },
    { question: "Does Kik offer demos?", answer: "Yes. Our team provides guided demos to help brands understand how Kik boosts visibility, conversions, and localized reach.", category: "brands" },
    { question: "What kind of analytics and reporting features does Kik offer?", answer: "Brands receive detailed performance metrics including impression tracking, click-through rates, shopper interest by city, and engagement heatmaps.", category: "brands" },
    { question: "Do you work with any third-party measurement providers?", answer: "Yes. Kik integrates with verified third-party measurement partners to ensure transparent campaign performance reporting.", category: "brands" },
    { question: "Does Kik have a newsletter?", answer: "Yes. Brands can subscribe to our monthly “Kik Insights” newsletter for trends, shopper behaviors, and platform updates.", category: "brands" },
    { question: "How can Kik support my brand? How is data security ensured with Kik?", answer: "We utilize encrypted connections, secure hosting, and routine audits to ensure brand data is protected at every level.", category: "brands" },
    { question: "How can Kik support my brand?", answer: "Kik helps brands reach shoppers looking for deals, increase visibility, and extend their digital promotional footprint city-by-city.", category: "brands" },
    { question: "Is Kik able to curate local or geography-specific offers?", answer: "Yes! Kik specializes in city-specific and neighborhood-specific offer displays so your ads reach the exact audience you want.", category: "brands" },
    { question: "How can I tell a story around my brand on Kik?", answer: "Brands can use banners, highlight sections, and seasonal promotions to create rich, engaging narratives for shoppers.", category: "brands" },

    // === FOR RETAILERS ===
    { question: "Who does Kik currently work with?", answer: "Kik works with supermarkets, local stores, electronics retailers, pharmacies, and other businesses offering weekly promotions.", category: "retailers" },
    { question: "Can I integrate my owned and operated properties?", answer: "Yes. Retailers can integrate store websites, product feeds, and promotional materials into Kik for unified shopper engagement.", category: "retailers" },
    { question: "Can you leverage my existing print promotional content?", answer: "Definitely. Kik can transform your print flyers into beautiful digital circulars optimized for mobile shoppers.", category: "retailers" },
    { question: "How can Kik support my retail business?", answer: "Kik drives traffic to your stores by showcasing weekly deals, popular items, and promotions to shoppers in your local area.", category: "retailers" },
    { question: "Does Kik offer demos?", answer: "Retailers can request interactive demos to understand growth opportunities with Kik.", category: "retailers" },
    { question: "What kind of analytics and reporting features does Kik offer?", answer: "Kik provides performance dashboards showing store impressions, product engagement, shopper interest and activity by location.", category: "retailers" },
    { question: "Do you work with any third-party measurement providers?", answer: "Yes — to ensure transparency, Kik supports third-party validation of campaign results where required.", category: "retailers" },
    { question: "Does Kik have a newsletter?", answer: "Yes! Retailers can subscribe to receive updates on shopper trends and platform tips.", category: "retailers" },
    { question: "is Kik accesesible to location in Nigeria?", answer: "Currently only for lagos but in time we will reach out to other state.", category: "retailers" },
    { question: "How is data security ensured with Kik?", answer: "Kik uses encrypted systems, secure servers, and strict compliance to protect retailer and shopper data end-to-end.", category: "retailers" },
  ], []);

  // Filtered results
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return { brands: [], retailers: [] };
    const q = searchQuery.toLowerCase();
    return {
      brands: allFaqs.filter(f => f.category === "brands" && (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))),
      retailers: allFaqs.filter(f => f.category === "retailers" && (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)))
    };
  }, [searchQuery, allFaqs]);

  const totalResults = filteredFaqs.brands.length + filteredFaqs.retailers.length;
  const hasResults = totalResults > 0;

  // Highlight matches
  const Highlight = ({ text }: { text: string }) => {
    if (!searchQuery.trim()) return <>{text}</>;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) => regex.test(part) ? <mark key={i} className="bg-yellow-300 text-black px-1 rounded font-medium">{part}</mark> : part)}
      </>
    );
  };

  // Copy to clipboard
  const copyAnswer = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-[#002551]">
      <header className="bg-[#031b34]/90 border-b border-white/10 sticky top-0 z-50">
        <Footerheader />
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/08/Hero-Mock-scaled.jpg" alt="Shopping" fill priority className="object-cover brightness-[0.55]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              You’ve got questions,<br />we’ve got answers
            </h1>
            <p className="text-xl text-gray-200 mb-10 max-w-lg">
              Search our knowledge base or reach out — we’re here to help.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  className="w-full rounded-full bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-300 pl-14 pr-12 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition"
                />
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                {localInput && (
                  <button onClick={() => { setLocalInput(""); setSearchQuery(""); }} className="absolute right-4 top-1/2 -translate-y-1/2">
                    <X className="w-6 h-6 text-gray-300 hover:text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Image src="/08/faq.png" alt="FAQ" width={600} height={400} className="rounded-2xl shadow-2xl" />
          </div>
        </div>
      </section>

      {/* RESULTS OR FULL LIST */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          {searchQuery.trim() ? (
            <div className="animate-fadeIn">
              <div className="text-center mb-10">
                <p className="text-xl">
                  {hasResults ? (
                    <>Found <strong className="text-[#002551]">{totalResults}</strong> result{totalResults > 1 && "s"} for <span className="font-semibold">“{searchQuery}”</span></>
                  ) : (
                    <>No results found for <span className="font-semibold">“{searchQuery}”</span></>
                  )}
                </p>
              </div>

              {!hasResults && (
                <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
                  <Sparkles className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                  <h3 className="text-2xl font-bold mb-4">We couldn’t find what you’re looking for</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">Try different keywords or contact us directly — we reply fast!</p>
                  <a href="/contact" className="inline-flex items-center gap-3 bg-[#002551] text-white px-8 py-4 rounded-full hover:bg-[#003d80] transition text-lg font-medium">
                    <MessageCircle className="w-6 h-6" /> Contact Support
                  </a>
                </div>
              )}

              {hasResults && (
                <>
                  {filteredFaqs.brands.length > 0 && (
                    <div className="mb-16">
                      <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                        For Brands ({filteredFaqs.brands.length})
                      </h3>
                      <Accordion type="single" collapsible className="space-y-4">
                        {filteredFaqs.brands.map((faq, i) => {
                          const id = `brand-${i}`;
                          return (
                            <AccordionItem key={id} value={id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                              <AccordionTrigger className="px-6 hover:no-underline">
                                <Highlight text={faq.question} />
                              </AccordionTrigger>
                              <AccordionContent className="px-6 pb-6 text-gray-700 relative">
                                <div className="pr-12">
                                  <Highlight text={faq.answer} />
                                </div>
                                <button
                                  onClick={() => copyAnswer(faq.answer, id)}
                                  className="absolute right-6 top-6 text-gray-500 hover:text-[#002551] transition"
                                  title="Copy answer"
                                >
                                  {copiedId === id ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                                </button>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </div>
                  )}

                  {filteredFaqs.retailers.length > 0 && (
                    <div>
                      <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        For Retailers ({filteredFaqs.retailers.length})
                      </h3>
                      <Accordion type="single" collapsible className="space-y-4">
                        {filteredFaqs.retailers.map((faq, i) => {
                          const id = `retailer-${i}`;
                          return (
                            <AccordionItem key={id} value={id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                              <AccordionTrigger className="px-6 hover:no-underline">
                                <Highlight text={faq.question} />
                              </AccordionTrigger>
                              <AccordionContent className="px-6 pb-6 text-gray-700 relative">
                                <div className="pr-12">
                                  <Highlight text={faq.answer} />
                                </div>
                                <button
                                  onClick={() => copyAnswer(faq.answer, id)}
                                  className="absolute right-6 top-6 text-gray-500 hover:text-[#002551] transition"
                                >
                                  {copiedId === id ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                                </button>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Full FAQ list when search is empty */
            <>
              <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
              {/* You can re-use your original FaqSection.tsx here if you want */}
              {/* Or just render the full list the same way */}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}