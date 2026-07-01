export function MarkdownEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      className="min-h-[260px] w-full rounded-lg border border-ld bg-transparent px-3 py-2 font-mono text-sm text-dark placeholder:text-bodytext focus:border-primary focus:outline-none"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="마크다운 원문"
    />
  );
}
