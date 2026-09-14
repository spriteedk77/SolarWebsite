import Link from 'next/link';
import type { Product } from '@/content/types';
import { Card } from '@/components/ui/Card';
import { Figure } from '@/components/ui/Figure';
import { Badge } from '@/components/ui/Badge';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card as="li" className="flex h-full flex-col">
      <Figure
        image={product.image}
        ratio="4/3"
        rounded={false}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="navy">{product.category}</Badge>
          <span className="text-caption font-semibold text-ink-600">{product.brand}</span>
        </div>

        <h3 className="mt-3 text-h3 leading-snug">{product.name}</h3>
        <p className="mt-2.5 text-caption text-ink-700">{product.description}</p>

        <dl className="mt-4 space-y-2.5 border-t border-hairline pt-4 text-caption">
          {product.specifications.map((spec) => (
            <div key={spec.label} className="flex flex-wrap gap-x-2">
              <dt className="text-ink-600">{spec.label}:</dt>
              <dd className="font-medium text-navy-900">
                {spec.value}
                {spec.note && (
                  <span className="mt-0.5 block text-[0.8125rem] font-normal text-ink-600">
                    {spec.note}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        {product.usedInProjects && product.usedInProjects.length > 0 && (
          <p className="mt-auto pt-5 text-caption">
            <Link
              href={`/projects/${product.usedInProjects[0]}`}
              className="font-semibold text-solar-700 underline-offset-4 hover:underline"
            >
              ดูผลงานที่ใช้อุปกรณ์นี้
            </Link>
          </p>
        )}
      </div>
    </Card>
  );
}
