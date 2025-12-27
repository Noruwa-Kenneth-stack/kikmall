import { Metadata } from "next";
import { helpArticles } from "@/lib/helpData";
import { HelpSearchHome } from "@/components/help/HelpSearchHome";

export const metadata: Metadata = {
  title: "Help Center | Kikmall",
  description:
    "Find answers to common questions about using Kikmall: accounts, store locator, flyers, privacy, and more.",
};

export default function HelpPage() {
  return <HelpSearchHome articles={helpArticles} />;
}
