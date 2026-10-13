import Storefront from '../Storefront';

export default async function StoreRoutePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const initialPath = `/${slug.map((part) => encodeURIComponent(part)).join('/')}`;
  return <Storefront initialPath={initialPath} />;
}
