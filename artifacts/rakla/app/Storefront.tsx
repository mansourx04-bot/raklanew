'use client';

import dynamic from 'next/dynamic';

const StorefrontApp = dynamic(() => import('@/App'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-pitch" aria-label="Loading store" />,
});

export default function Storefront() {
  return <StorefrontApp />;
}
