export const PRODUCT_IDS = {
  card: '550e8400-e29b-41d4-a716-446655440003',
  remittance: '550e8400-e29b-41d4-a716-446655440004',
} as const;

export const mapProductTypeToIds = (
  productType: {
    card: boolean;
    remittance: boolean;
    both: boolean;
  },
  productOptions?: Array<{ id: string; name: string }>
) => {
  if (productOptions) {
    // If product options are provided, use dynamic mapping
    return Object.keys(productType)
      .filter((key) => productType[key as keyof typeof productType])
      .map((key) => productOptions.find((product) => product.name.toLowerCase() === key.toLowerCase())?.id)
      .filter(Boolean) as string[];
  }

  // Otherwise use static mapping
  const product_ids: string[] = [];
  if (productType.card) {
    product_ids.push(PRODUCT_IDS.card);
  }
  if (productType.remittance) {
    product_ids.push(PRODUCT_IDS.remittance);
  }
  return product_ids;
};
