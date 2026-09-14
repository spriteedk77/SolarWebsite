import { NotFoundContent } from '@/components/layout/NotFoundContent';

/** 404s raised from inside a site route; the group's layout supplies the chrome. */
export default function NotFound() {
  return <NotFoundContent />;
}
