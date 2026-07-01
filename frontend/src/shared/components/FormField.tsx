export function FormField({ label, required, error, help, children }: { label: string; required?: boolean; error?: string; help?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-sm font-semibold leading-none text-dark">
        {label}{required && <span className="text-error">*</span>}
      </span>
      {children}
      {help && !error && <span className="mt-2 block text-xs font-medium text-bodytext">{help}</span>}
      {error && <span role="alert" className="mt-2 block text-xs font-semibold text-error">{error}</span>}
    </label>
  );
}
