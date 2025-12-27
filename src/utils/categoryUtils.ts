export interface CategoryItem {
  name: string;
  count: number;
}

export const generateCategories = (
  countsByCategory: Record<string, number>
): CategoryItem[] => {
  const categoryNames = [
    "Store Category",
    "Groceries",
    "Pharmacy",
    "General Merchandise",
    "Electronics",
    "Fashion",
     ];

  return categoryNames.map((name) => ({
    name,
    count:
      name === "Store Category"
        ? Object.values(countsByCategory).reduce((a, b) => a + b, 0)
        : countsByCategory[name] || 0,
  }));
};
