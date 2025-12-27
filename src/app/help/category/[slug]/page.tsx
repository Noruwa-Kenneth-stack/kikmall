import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getArticlesByCategory,
  getCategoryBySlug,
  helpCategories,
  HelpCategorySlug,
} from "@/lib/helpData";
import { Breadcrumbs } from "@/components/help/Breadcrumbs";
import Link from "next/link";
import Footer from "@/components/Footer";
type Params = { slug: HelpCategorySlug };
import Footerheader from "@/components/Footer-header";

export function generateMetadata({ params }: { params: Params }): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: `${category.title} | Help Center | Kikmall`,
    description: category.description,
  };
}

export default function HelpCategoryPage({ params }: { params: Params }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) return notFound();

  const articles = getArticlesByCategory(category.slug);

  return (
    <div>
      <header className="bg-[#031b34]/90 border-b border-white/10 sticky top-0 z-50">
        <Footerheader />
      </header>
      <div className="max-w-5xl mx-auto px-5 py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Help Center", href: "/help" },
            { label: category.title },
          ]}
        />

        <div className="grid md:grid-cols-[220px_1fr] gap-8">
          {/* Sticky sidebar with all categories */}
          <aside className="md:sticky md:top-24 h-fit bg-gray-50 border rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Sections
            </p>
            <ul className="space-y-1 text-sm">
              {helpCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/help/category/${cat.slug}`}
                    className={`block px-2 py-1 rounded ${
                      cat.slug === category.slug
                        ? "bg-cyan-50 text-cyan-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Article list */}
          <main>
            <h1 className="text-3xl font-bold mb-2">{category.title}</h1>
            <p className="text-gray-600 mb-6">{category.description}</p>

            {articles.length === 0 ? (
              <p className="text-gray-500">No articles yet in this section.</p>
            ) : (
              <ul className="space-y-4">
                {articles.map((article) => (
                  <li
                    key={article.slug}
                    className="bg-white border rounded-lg p-4 hover:shadow-sm transition"
                  >
                    <Link
                      href={`/help/article/${article.slug}`}
                      className="text-lg font-semibold text-cyan-700 hover:underline"
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
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
