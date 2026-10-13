import App from '@/App';

export default function Storefront({ initialPath = '/' }: { initialPath?: string }) {
  return <App initialPath={initialPath} />;
}
