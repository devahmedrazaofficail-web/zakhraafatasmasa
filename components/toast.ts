/* Tiny toast helper targeting the #toast element rendered by the root layout.
   Matches the original site's toast behavior. */

export function showToast(msg: string): void {
  if (typeof document === 'undefined') return;
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  const prev = (t as unknown as { _h?: ReturnType<typeof setTimeout> })._h;
  clearTimeout(prev);
  (t as unknown as { _h?: ReturnType<typeof setTimeout> })._h = setTimeout(
    () => t.classList.remove('show'),
    1600
  );
}
