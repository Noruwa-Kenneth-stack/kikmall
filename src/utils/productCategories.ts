export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  product_status: string;
  brands: string;
}

export interface CategoryItem {
  name: string;
  subcategories: string[];
}

export const categoryStructure: Record<string, string[]> = {
  Beverages: [
    "Coffee",
    "Craft Beer",
    "Milk & Plant-Based Milk",
    "Soda & Pop",    
    "Tea",
    "Water",
    "Wine",
  ],
  "Breakfast & Dairy": [
    "Butter and Margarine",
    "Cheese",
    "Eggs Substitutes",
    "Honey",
    "Marmalades",
    "Milk & Flavoured Milk",
    "Sour Cream and Dips",
    "Yogurt",
    "Pasta",
  ],
  "Electronics & Accessories": [
    "Batteries",
    "Cameras",
    "Cell Phones",
    "Computers",
    "Headphones",
    "Laptops",
    "Mobile Phones",
    "Power Banks",
    "Tablets",
    "TVs",
  ],
  "Meats & Seafood": [
    "Beef",
    "Breakfast Sausage",
    "Chicken",
    "Crab and Shellfish",
    "Dinner Sausage",
    "Farm Raised Fillets",
    "Shrimp",
    "Sliced Deli Meat",
    "Wild Caught Fillets",
  ],
  "Home Appliances": [
    "Air Conditioners",
    "Air Purifiers",
    "Blenders",
    "Cloths Dryers",
    "Cooktops",
    "Dishwashers",
    "Electric Ranges",
    "Fans",
    "Freezers",
    "Gas Stoves",
    "Heating Oil",
    "Irons",
    "Kitchen Tools",
    "Microwaves",
    "Ovens",
    "Refrigerators",
    "Saunas",
    "Smoke Detectors",
    "Stovepipes",
    "Washers",
    "Water Heaters",
  ],
  "Personal Care": [
    "Bath & Body",
    "Cosmetics",
    "Deodorants",
    "Face Care",
    "Fragrances",
    "Hair Care",
    "Makeup",
    "Shaving & Hair Removal",
    "Skin Care",
    "Toothpaste",
  ],
};

export const productCategories: CategoryItem[] = Object.entries(categoryStructure).map(([name, subcategories]) => ({
  name,
  subcategories,
}));

