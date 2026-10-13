import Storefront from '../../Storefront';

export default async function ProductDetailsPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  return <Storefront initialPath={`/products/${encodeURIComponent(productId)}`} />;
}
