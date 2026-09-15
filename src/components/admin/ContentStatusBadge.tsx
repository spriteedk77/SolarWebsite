export function ContentStatusBadge({ status }: { status: 'draft' | 'published' }) {
  const draft = status === 'draft';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-caption font-semibold ${
        draft
          ? 'border-yellow-300 bg-yellow-50 text-yellow-800'
          : 'border-green-300 bg-green-50 text-green-800'
      }`}
    >
      {draft ? 'ฉบับร่าง' : 'เผยแพร่แล้ว'}
    </span>
  );
}
