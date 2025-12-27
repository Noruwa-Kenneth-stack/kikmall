import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import {
  getArticleBySlug,
  getCategoryBySlug,
  getArticlesByCategory,
} from "@/lib/helpData";
import { Breadcrumbs } from "@/components/help/Breadcrumbs";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Footerheader from "@/components/Footer-header";

type Params = { slug: string };

export function generateMetadata({ params }: { params: Params }): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};

  return {
    title: `${article.title} | Help Center | Kikmall`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
    },
  };
}

export default function HelpArticlePage({ params }: { params: Params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return notFound();

  const category = getCategoryBySlug(article.category);
  const siblings = getArticlesByCategory(article.category);

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
            category
              ? {
                  label: category.title,
                  href: `/help/category/${category.slug}`,
                }
              : { label: "All Articles", href: "/help" },
            { label: article.title },
          ]}
        />

        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          {/* SIDEBAR */}
          <aside className="md:sticky md:top-24 h-fit bg-gray-50 border rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
              More in this section
            </p>

            <ul className="space-y-1 text-sm">
              {siblings.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/help/article/${a.slug}`}
                    className={`block px-2 py-1 rounded ${
                      a.slug === article.slug
                        ? "bg-cyan-50 text-cyan-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* ARTICLE */}
          <article className="prose prose-gray max-w-none">
            <h1>{article.title}</h1>
            <p className="lead">{article.summary}</p>
            <ReactMarkdown>{article.body}</ReactMarkdown>
          </article>
        </div>
      </div>
      <Footer />
    </div>
  );
}
