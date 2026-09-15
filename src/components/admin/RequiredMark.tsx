export function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="ml-1 text-red-700">*</span>
      <span className="sr-only"> (จำเป็น)</span>
    </>
  );
}
