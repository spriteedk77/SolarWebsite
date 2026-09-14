'use client';

import { useActionState } from 'react';
import { saveSiteInfoAction, type FormState } from '@/app/admin/actions';
import { fieldGroups } from '@/admin/site-info/fields';
import type { SiteInfoValues } from '@/admin/site-info/model';
import { ServiceAreasEditor } from './ServiceAreasEditor';

const initial: FormState = { status: 'idle' };

/**
 * The short form for the details that change: who to call, where to find NP88,
 * and what the homepage says.
 *
 * A plain HTML form posting to a server action, so it works the same whether
 * or not the JavaScript has loaded, and so nothing about what may be saved is
 * decided in the browser. What comes back is either the saved confirmation or
 * the field-by-field reasons it was not.
 */
export function SiteInfoForm({
  values,
  canSave = true,
}: {
  values: SiteInfoValues;
  /** False before the CMS connection exists; the page explains why above. */
  canSave?: boolean;
}) {
  const [state, action, pending] = useActionState(saveSiteInfoAction, initial);

  return (
    <form action={action} noValidate>
      <div className="space-y-8">
        {fieldGroups.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`group-${group.id}`}
            className="rounded-card border border-hairline bg-white p-6 sm:p-8"
          >
            <h2 id={`group-${group.id}`} className="text-h3">
              {group.title}
            </h2>
            <p className="mt-1 text-caption text-ink-600">{group.description}</p>

            <div className="mt-6 space-y-6">
              {group.fields.map((field) => {
                const error = state.errors?.[field.name];
                const id = `field-${field.name}`;
                const helpId = field.help ? `${id}-help` : undefined;
                const errorId = error ? `${id}-error` : undefined;
                const describedBy =
                  [helpId, errorId].filter(Boolean).join(' ') || undefined;
                const className = [
                  'mt-2 w-full rounded-lg border bg-white px-4 py-3 text-body text-ink-900',
                  'focus:border-solar-600 focus:outline-none',
                  error ? 'border-red-600' : 'border-hairline',
                ].join(' ');

                return (
                  <div key={field.name}>
                    <label
                      htmlFor={id}
                      className="text-body font-semibold text-navy-900"
                    >
                      {field.label}
                    </label>
                    {field.help && (
                      <p id={helpId} className="mt-1 text-caption text-ink-600">
                        {field.help}
                      </p>
                    )}

                    {field.name === 'serviceAreas' ? (
                      <ServiceAreasEditor
                        value={values.serviceAreas}
                        error={error}
                        describedBy={describedBy}
                      />
                    ) : field.multiline ? (
                      <textarea
                        id={id}
                        name={field.name}
                        rows={3}
                        defaultValue={values[field.name]}
                        placeholder={field.placeholder}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedBy}
                        className={className}
                      />
                    ) : (
                      <input
                        id={id}
                        name={field.name}
                        type="text"
                        defaultValue={values[field.name]}
                        placeholder={field.placeholder}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedBy}
                        className={className}
                      />
                    )}

                    {error && field.name !== 'serviceAreas' && (
                      <p
                        id={errorId}
                        className="mt-2 text-caption font-medium text-red-700"
                      >
                        {error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="sticky bottom-0 mt-8 border-t border-hairline bg-soft py-4">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending || !canSave}
            className="inline-flex min-h-12 items-center rounded-lg bg-solar-600 px-7 font-semibold text-white hover:bg-solar-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'กำลังบันทึก…' : 'บันทึก'}
          </button>

          {state.status === 'ok' && state.message && (
            <p role="status" className="text-body font-medium text-green-700">
              {state.message}
            </p>
          )}
          {state.status === 'error' && state.message && (
            <p role="alert" className="text-body font-medium text-red-700">
              {state.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
