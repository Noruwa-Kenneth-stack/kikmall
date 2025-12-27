// mock/products.ts
import { Product } from "@/types/flyerProduct";

export const mockProducts: Product[] = [
  {
    id: "p1",
    storeId: "1",
    name: "Organic Apples",
    category: "Groceries",
    image: "/assets/apple.png",
    originalPrice: 3.99,
    salePrice: 2.49,
    rating: 4.5,
    isHot: true,
  },
  {
    id: "p2",
    storeId: "1",
    name: "Pain Relief Tablets",
    category: "Pharmacy",
    image: "/assets/products/painkiller.png",
    salePrice: 5.49,          // 🔹 no originalPrice
    rating: 4.0,
    isHot: true,
  },
  {
    id: "p3",
    storeId: "1",
    name: "Bluetooth Headphones",
    category: "Electronics",
    image: "/assets/products/headphones.png",
    salePrice: 39.99,         // 🔹 only sale price
    rating: 4.7,
    isHot: false,             
  },
  {
    id: "p4",
    storeId: "1",
    name: "Casual T-Shirt",
    category: "Fashion",
    image: "/assets/products/tshirt.png",
    originalPrice: 19.99,
    salePrice: 12.99,
    rating: 4.2,
    isHot: true,
  },
  {
    id: "p5",
    storeId: "1",
    name: "Kitchen Blender",
    category: "General Merchandise",
    image: "/assets/products/blender.png",
    originalPrice: 89.99,
    salePrice: 69.99,
    rating: 4.8,
    isHot: false,
  },
];
