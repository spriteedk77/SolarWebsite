/**
 * Renders a Schema.org JSON-LD document.
 *
 * The payload is built server-side from our own typed builders in
 * `src/lib/schema.ts`, never from user input.
 */
export function JsonLd({ data, id }: { data: object; id?: string }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
