"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqSection() {
  return (
    <section className="text-[#002551] py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* ====== FOR BRANDS ====== */}
        <h2 className="text-3xl font-bold mb-6">For Brands</h2>
        <p className="text-gray-600 mb-10">
          Learn more about how Kik supports brands with digital promotions,
          analytics, and reach.
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="b1">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              Who does Kik currently work with?
            </AccordionTrigger>
            <AccordionContent className="accordion-content">
              Kik collaborates with both emerging and established brands across
              groceries, electronics, fashion, and household categories. Our
              platform helps brands reach shoppers looking for deals in their
              local area.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="b2">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              Can I integrate my owned and operated properties?
            </AccordionTrigger>
            <AccordionContent className="accordion-content">
              Yes. Kik allows brands to integrate existing owned content such as
              digital brochures, promotional graphics, and product listings into
              their store pages.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="b3">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              Can you leverage my existing print promotional content?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely. If your brand already produces print flyers or
              promotional catalogs, Kik can digitize and optimize them for
              mobile users.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="b4">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              Does Kik offer demos?
            </AccordionTrigger>
            <AccordionContent>
              Yes. Our team provides guided demos to help brands understand how
              Kik boosts visibility, conversions, and localized reach.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="b5">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              What kind of analytics and reporting features does Kik offer?
            </AccordionTrigger>
            <AccordionContent>
              Brands receive detailed performance metrics including impression
              tracking, click-through rates, shopper interest by city, and
              engagement heatmaps.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="b6">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              Do you work with any third-party measurement providers?
            </AccordionTrigger>
            <AccordionContent>
              Yes. Kik integrates with verified third-party measurement partners
              to ensure transparent campaign performance reporting.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="b7">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              Does Kik have a newsletter?
            </AccordionTrigger>
            <AccordionContent>
              Yes. Brands can subscribe to our monthly “Kik Insights” newsletter
              for trends, shopper behaviors, and platform updates.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="b9">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              How can Kik support my brand? How is data security ensured with
              Kik?
            </AccordionTrigger>
            <AccordionContent>
              We utilize encrypted connections, secure hosting, and routine
              audits to ensure brand data is protected at every level.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="b10">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              How can Kik support my brand?
            </AccordionTrigger>
            <AccordionContent>
              Kik helps brands reach shoppers looking for deals, increase
              visibility, and extend their digital promotional footprint
              city-by-city.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="b11">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              Is Kik able to curate local or geography-specific offers?
            </AccordionTrigger>
            <AccordionContent>
              Yes! Kik specializes in city-specific and neighborhood-specific
              offer displays so your ads reach the exact audience you want.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="b12">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              How can I tell a story around my brand on Kik?
            </AccordionTrigger>
            <AccordionContent>
              Brands can use banners, highlight sections, and seasonal
              promotions to create rich, engaging narratives for shoppers.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* ========= DIVIDER ========= */}
        <div className="w-full h-px bg-white/10 my-16"></div>

        {/* ====== FOR RETAILERS ====== */}
        <h2 className="text-3xl font-bold mb-6">For Retailers</h2>
        <p className="text-gray-300 mb-10">
          Learn more about how Kik helps retailers drive traffic and increase
          weekly sales.
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="r1">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              Who does Kik currently work with?
            </AccordionTrigger>
            <AccordionContent>
              Kik works with supermarkets, local stores, electronics retailers,
              pharmacies, and other businesses offering weekly promotions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="r2">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              Can I integrate my owned and operated properties?
            </AccordionTrigger>
            <AccordionContent>
              Yes. Retailers can integrate store websites, product feeds, and
              promotional materials into Kik for unified shopper engagement.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="r3">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              Can you leverage my existing print promotional content?
            </AccordionTrigger>
            <AccordionContent>
              Definitely. Kik can transform your print flyers into beautiful
              digital circulars optimized for mobile shoppers.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="r4">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              How can Kik support my retail business?
            </AccordionTrigger>
            <AccordionContent>
              Kik drives traffic to your stores by showcasing weekly deals,
              popular items, and promotions to shoppers in your local area.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="r5">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              Does Kik offer demos?
            </AccordionTrigger>
            <AccordionContent>
              Retailers can request interactive demos to understand growth
              opportunities with Kik.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="r6">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              What kind of analytics and reporting features does Kik offer?
            </AccordionTrigger>
            <AccordionContent>
              Kik provides performance dashboards showing store impressions,
              product engagement, shopper interest and activity by location.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="r7">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              Do you work with any third-party measurement providers?
            </AccordionTrigger>
            <AccordionContent>
              Yes — to ensure transparency, Kik supports third-party validation
              of campaign results where required.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="r8">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              Does Kik have a newsletter?
            </AccordionTrigger>
            <AccordionContent>
              Yes! Retailers can subscribe to receive updates on shopper trends
              and platform tips.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="r9">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              is  Kik accesesible to location in Nigeria?
            </AccordionTrigger>
            <AccordionContent>
              Currently only for lagos but in time we will reach  out  to other state.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="r10">
            <AccordionTrigger className="hover:text-black transition-colors duration-200">
              How is data security ensured with Kik?
            </AccordionTrigger>
            <AccordionContent>
              Kik uses encrypted systems, secure servers, and strict compliance
              to protect retailer and shopper data end-to-end.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
