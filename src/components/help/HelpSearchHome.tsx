"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, User, Map, AppWindow, List, Tag, Shield } from "lucide-react";
import { HelpArticle, HelpCategory, helpCategories } from "@/lib/helpData";
import Footerheader from "@/components/Footer-header";
import Footer from "@/components/Footer";

function getIcon(iconId: HelpCategory["icon"]) {
  const className = "h-5 w-5 text-cyan-500";
  switch (iconId) {
    case "user":
      return <User className={className} />;
    case "map":
      return <Map className={className} />;
    case "app":
      return <AppWindow className={className} />;
    case "list":
      return <List className={className} />;
    case "tag":
      return <Tag className={className} />;
    case "shield":
      return <Shield className={className} />;
    default:
      return null;
  }
}

export function HelpSearchHome({ articles }: { articles: HelpArticle[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return articles.filter((a) => {
      return (
        a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
      );
    });
  }, [articles, query]);

  return (
    <div className="min-h-screen bg-gray-50 p">
      <header className="bg-[#031b34]/90 border-b border-white/10 sticky top-0 z-50">
        <Footerheader />
      </header>
      {/* HERO */}
      <div className="bg-[#031b34] text-white py-16">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Help Center</h1>
          <p className="mt-3 text-gray-300">
            Find answers about using Kikmall for smarter shopping.
          </p>

          {/* SEARCH BAR */}
          <div className="relative max-w-xl mx-auto mt-8">
            <input
              type="text"
              placeholder="Search for help articles (e.g. location, flyers, shopping list)"
              className="w-full px-4 py-3 rounded-full bg-white text-gray-800 shadow focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 mt-10">
        {/* SEARCH RESULTS */}
        {query.trim() && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3">
              Search results ({filtered.length})
            </h2>
            {filtered.length === 0 ? (
              <p className="text-gray-500">
                No articles matched your search. Try another keyword.
              </p>
            ) : (
              <ul className="space-y-3">
                {filtered.map((article) => (
                  <li
                    key={article.slug}
                    className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition"
                  >
                    <Link
                      href={`/help/article/${article.slug}`}
                      className="text-cyan-700 font-semibold hover:underline"
                    >
                      {article.title}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {article.summary}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* CATEGORY GRID (shown always) */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {helpCategories.map((cat) => (
            <div
              key={cat.slug}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg border transition"
            >
              <div className="flex items-center gap-2 mb-2">
                {getIcon(cat.icon)}
                <h2 className="text-xl font-semibold">{cat.title}</h2>
              </div>
              <p className="text-gray-600 mb-4">{cat.description}</p>

              <Link
                href={`/help/category/${cat.slug}`}
                className="inline-flex items-center text-sm font-medium text-cyan-700 hover:underline"
              >
                Browse articles →
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
