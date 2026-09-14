import { useCallback, useEffect, useState } from 'react';
import { useClient, useCurrentUser } from 'sanity';
import { fieldGroups } from './fields';
import {
  fromDocuments,
  toPatches,
  validate,
  type SiteInfoValues,
} from './model';

/**
 * The short form for the details that change: who to call, where to find NP88,
 * and what the homepage says.
 *
 * It writes to the same two documents the document editor does — the company
 * document and the site settings — through the signed-in editor's own Sanity
 * session. There is no token in this application and no endpoint of our own
 * behind it: whatever a person is allowed to change in the Studio is exactly
 * what they can change here, and nothing else.
 *
 * Styling is the website's own, because /admin is served by the website and
 * globals.css is already loaded — the same tokens, the same Prompt, so the form
 * reads as part of the site rather than as a different product.
 */

const API_VERSION = '2026-01-01';
const COMPANY_ID = 'company';
const SETTINGS_ID = 'siteSettings';
const draftId = (id: string) => `drafts.${id}`;

type Status =
  | { kind: 'loading' }
  | { kind: 'ready' }
  | { kind: 'saving' }
  | { kind: 'saved'; at: string }
  | { kind: 'error'; message: string };

export function SiteInfoTool() {
  const client = useClient({ apiVersion: API_VERSION });
  const user = useCurrentUser();

  const [values, setValues] = useState<SiteInfoValues | null>(null);
  const [errors, setErrors] = useState<Partial<
    Record<keyof SiteInfoValues, string>
  > | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'loading' });

  // Does not announce "loading" itself: the first run happens from an effect,
  // where setting state synchronously is a re-render the component does not
  // need — it already starts in that state. The reload button says so instead.
  const load = useCallback(async () => {
    try {
      // The draft is what an editor is working on; fall back to what is live.
      const [companyDraft, company, settingsDraft, settings] =
        await client.getDocuments([
          draftId(COMPANY_ID),
          COMPANY_ID,
          draftId(SETTINGS_ID),
          SETTINGS_ID,
        ]);
      setValues(
        fromDocuments(companyDraft ?? company, settingsDraft ?? settings),
      );
      setStatus({ kind: 'ready' });
    } catch (error) {
      setStatus({
        kind: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'อ่านข้อมูลไม่สำเร็จ กรุณาลองใหม่',
      });
    }
  }, [client]);

  useEffect(() => {
    // The rule reads `load` as setting state inside the effect body. It does
    // not: every setState in it runs after the request resolves, which is a
    // later tick, not a cascading render. Fetching the two documents when the
    // tool opens is the whole reason this component exists, and there is no
    // render-time or event-handler path that could do it instead.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const save = async () => {
    if (!values) return;
    const found = validate(values);
    setErrors(found);
    if (found) {
      setStatus({
        kind: 'error',
        message: 'ยังมีช่องที่ต้องแก้ ดูข้อความสีแดงใต้ช่องนั้น',
      });
      return;
    }

    setStatus({ kind: 'saving' });
    try {
      const { company, settings } = toPatches(values);
      // Written as a draft, never straight to the live site. Reviewing and
      // publishing stays one deliberate step, in the document editor.
      await client
        .transaction()
        .createIfNotExists({ _id: draftId(COMPANY_ID), _type: 'company' })
        .createIfNotExists({
          _id: draftId(SETTINGS_ID),
          _type: 'siteSettings',
        })
        .patch(draftId(COMPANY_ID), (patch) => patch.set(company))
        .patch(draftId(SETTINGS_ID), (patch) => patch.set(settings))
        .commit();
      setStatus({
        kind: 'saved',
        at: new Date().toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error instanceof Error ? error.message : 'บันทึกไม่สำเร็จ',
      });
    }
  };

  if (status.kind === 'loading' || !values)
    return (
      <Shell>
        <p className="text-body text-ink-600">กำลังโหลดข้อมูล…</p>
      </Shell>
    );

  return (
    <Shell>
      <header className="mb-8">
        <p className="text-caption font-semibold tracking-wide text-solar-700 uppercase">
          {user?.name ? `สวัสดี ${user.name}` : 'จัดการเนื้อหา'}
        </p>
        <h1 className="mt-2 text-h2">ข้อมูลเว็บไซต์</h1>
        <p className="mt-3 max-w-prose text-body text-ink-600">
          แก้ช่องทางติดต่อ ที่อยู่ และข้อความหน้าแรกได้จากหน้านี้
          การบันทึกจะเก็บเป็นฉบับร่าง ยังไม่ขึ้นเว็บจริงจนกว่าจะกดเผยแพร่
        </p>
      </header>

      <div className="space-y-10">
        {fieldGroups.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`group-${group.id}`}
            className="rounded-card border border-hairline bg-white p-6 sm:p-7"
          >
            <h2 id={`group-${group.id}`} className="text-h3">
              {group.title}
            </h2>
            <p className="mt-1 text-caption text-ink-600">{group.description}</p>

            <div className="mt-6 space-y-5">
              {group.fields.map((field) => {
                const error = errors?.[field.name];
                const inputId = `field-${field.name}`;
                const helpId = field.help ? `${inputId}-help` : undefined;
                const errorId = error ? `${inputId}-error` : undefined;
                const describedBy =
                  [helpId, errorId].filter(Boolean).join(' ') || undefined;
                const className = [
                  'mt-2 w-full rounded-lg border bg-white px-4 py-3 text-body text-ink-900',
                  'focus:border-solar-600 focus:outline-none',
                  error ? 'border-red-600' : 'border-hairline',
                ].join(' ');
                const onChange = (
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >,
                ) => setValues({ ...values, [field.name]: event.target.value });

                return (
                  <div key={field.name}>
                    <label
                      htmlFor={inputId}
                      className="text-body font-semibold text-navy-900"
                    >
                      {field.label}
                    </label>
                    {field.help && (
                      <p id={helpId} className="mt-1 text-caption text-ink-600">
                        {field.help}
                      </p>
                    )}
                    {field.multiline ? (
                      <textarea
                        id={inputId}
                        rows={3}
                        value={values[field.name]}
                        placeholder={field.placeholder}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedBy}
                        onChange={onChange}
                        className={className}
                      />
                    ) : (
                      <input
                        id={inputId}
                        type="text"
                        value={values[field.name]}
                        placeholder={field.placeholder}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedBy}
                        onChange={onChange}
                        className={className}
                      />
                    )}
                    {error && (
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

      <div className="sticky bottom-0 mt-8 flex flex-wrap items-center gap-4 border-t border-hairline bg-soft py-4">
        <button
          type="button"
          onClick={() => void save()}
          disabled={status.kind === 'saving'}
          className="inline-flex min-h-12 items-center rounded-lg bg-solar-600 px-6 font-semibold text-white hover:bg-solar-700 disabled:opacity-60"
        >
          {status.kind === 'saving' ? 'กำลังบันทึก…' : 'บันทึกฉบับร่าง'}
        </button>
        <button
          type="button"
          onClick={() => {
            setErrors(null);
            setStatus({ kind: 'loading' });
            void load();
          }}
          disabled={status.kind === 'saving'}
          className="inline-flex min-h-12 items-center rounded-lg border border-hairline bg-white px-5 font-semibold text-navy-900 hover:border-solar-400"
        >
          ย้อนกลับเป็นค่าที่บันทึกไว้
        </button>

        {status.kind === 'saved' && (
          <p className="text-body font-medium text-green-700">
            บันทึกแล้วเมื่อ {status.at} — ตรวจและกดเผยแพร่ในหน้า เนื้อหาเว็บไซต์
          </p>
        )}
        {status.kind === 'error' && (
          <p className="text-body font-medium text-red-700">{status.message}</p>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto bg-soft">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
        {children}
      </div>
    </div>
  );
}
