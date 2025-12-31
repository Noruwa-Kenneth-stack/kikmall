export const getProductImage = (image?: string | null) => {
  if (!image) return "/products/default.png";

  const trimmed = image.trim();

  // already a full URL (CDN, S3, etc.)
  if (trimmed.startsWith("http")) return trimmed;

  // already has /products
  if (trimmed.startsWith("/products/")) return trimmed;

  // filename only
  return `/products/${trimmed}`;
};
