export function ConfirmModal({ open, title, message, onConfirm, onCancel }: { open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null;
  return <div role="dialog" aria-modal="true" style={{position:'fixed', inset:0, background:'rgba(28,37,54,.28)', display:'grid', placeItems:'center', zIndex:50}}><div className="card" style={{width:'min(420px, 92vw)'}}><h3>{title}</h3><p className="text-muted">{message}</p><div style={{display:'flex', justifyContent:'flex-end', gap:12}}><button className="button secondary" onClick={onCancel}>취소</button><button className="button danger" onClick={onConfirm}>확인</button></div></div></div>;
}
