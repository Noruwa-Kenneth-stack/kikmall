// src/lib/helpData.ts
export type HelpCategorySlug =
  | "account"
  | "using-kikmall"
  | "store-locator"
  | "shopping-list"
  | "deals-flyers"
  | "privacy";

export type HelpIconId =
  | "user"
  | "app"
  | "map"
  | "list"
  | "tag"
  | "shield";

export interface HelpCategory {
  slug: HelpCategorySlug;
  title: string;
  description: string;
  icon: HelpIconId;
}

export interface HelpArticle {
  slug: string; // e.g. "how-to-create-an-account"
  title: string;
  summary: string;
  body: string; // markdown
  category: HelpCategorySlug;
}

export const helpCategories: HelpCategory[] = [
  {
    slug: "account",
    title: "Account & Profile",
    description: "Managing your Kik account, profile, and preferences.",
    icon: "user",
  },
  {
    slug: "using-kikmall",
    title: "Using Kikmall",
    description: "Basics of browsing stores, flyers, and products.",
    icon: "app",
  },
  {
    slug: "store-locator",
    title: "Store Locator",
    description: "Finding nearby stores and understanding distance.",
    icon: "map",
  },
  {
    slug: "shopping-list",
    title: "Shopping List",
    description: "Adding, editing, and managing your shopping lists.",
    icon: "list",
  },
  {
    slug: "deals-flyers",
    title: "Deals & Flyers",
    description: "How deals, weekly flyers, and hot offers work.",
    icon: "tag",
  },
  {
    slug: "privacy",
    title: "Privacy & Security",
    description: "How we use your data and keep it safe.",
    icon: "shield",
  },
];

// --- sample markdown articles (keep adding as needed) ---
export const helpArticles: HelpArticle[] = [
  {
    slug: "how-to-create-an-account",
    title: "How to Create an Account",
    summary: "Create a free Kik account in a few simple steps.",
    category: "account",
    body: `
Creating a Kik account lets you save your shopping lists, favorite stores, and preferred city.

### On web

1. Click **Sign In** in the top navigation.
2. Select **Create account**.
3. Enter your email address and a secure password.
4. Confirm your email if prompted.

Once your account is created, you can sync favorites and shopping lists across devices.
    `.trim(),
  },
  {
    slug: "how-to-change-your-city",
    title: "How to Change Your City",
    summary:
      "Update your city so we can show you stores and flyers that are actually near you.",
    category: "account",
    body: `
Your city controls which stores, flyers, and prices you see.

### Change city from the homepage

1. On the homepage, locate the **area / city** input.
2. Type your city or area (for example, \`Ojo\` or \`Ikeja\`).
3. Click **Start Saving**.

We'll save your choice in your browser so the same city is used next time you visit.
    `.trim(),
  },
  {
    slug: "how-to-search-for-products",
    title: "How to Search for Products",
    summary: "Find products across multiple stores quickly.",
    category: "using-kikmall",
    body: `
Use the global search bar in the header to search for products or stores.

- Type what you're looking for, e.g. \`rice\` or \`Twin Faja\`.
- Suggestions appear under the search bar.
- Click a **store** to open that store's flyers.
- Click a **product** to see matching deals by store.
    `.trim(),
  },
  {
    slug: "why-location-isnt-working",
    title: "Why Location Isn't Working",
    summary: "Troubleshooting when the app can't detect your location.",
    category: "store-locator",
    body: `
Kik uses your browser's location to find stores close to you.

Common reasons location may fail:

- Your browser blocked location access.
- You're using a VPN or proxy that hides your location.
- GPS is disabled on your device.

You can always **type your city manually** in the location field if detection fails.
    `.trim(),
  },
  {
    slug: "how-we-use-your-location",
    title: "How We Use Your Location",
    summary: "Understand how location data is used and stored.",
    category: "privacy",
    body: `
We use your approximate location only to:

- Show stores and flyers near you.
- Calculate distance from you to each store in the Store Locator.

We **do not** sell your location data. You can disable location sharing in your browser and enter your city manually instead.
    `.trim(),
  },
];

// helpers
export function getCategoryBySlug(
  slug: HelpCategorySlug
): HelpCategory | undefined {
  return helpCategories.find((c) => c.slug === slug);
}

export function getArticleBySlug(
  slug: string
): HelpArticle | undefined {
  return helpArticles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(
  category: HelpCategorySlug
): HelpArticle[] {
  return helpArticles.filter((a) => a.category === category);
}
