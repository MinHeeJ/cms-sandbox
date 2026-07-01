import { FormField } from '../../../shared/components/FormField';
import { AttachmentUploadPanel } from '../../attachments/components/AttachmentUploadPanel';
import { MarkdownEditor } from './MarkdownEditor';

export function DocumentForm({ title, markdown, onTitle, onMarkdown, onSave }: { title: string; markdown: string; onTitle: (v:string)=>void; onMarkdown:(v:string)=>void; onSave:()=>void }) {
  return (
    <div className="rounded-lg border border-ld bg-white p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dark">문서 작성</h3>
        <p className="mt-1 text-sm font-medium text-bodytext">필수값, 발행 상태, 마크다운 원문을 검토합니다.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField label="문서 제목" required help="포털 검색 결과에 그대로 표시됩니다.">
          <input className="h-10 w-full rounded-lg border border-ld bg-transparent px-3 py-2 text-sm text-dark placeholder:text-bodytext focus:border-primary focus:outline-none" value={title} onChange={(event) => onTitle(event.target.value)} placeholder="운영 가이드" />
        </FormField>
        <FormField label="발행 상태">
          <select className="h-10 w-full rounded-lg border border-ld bg-transparent px-3 py-2 text-sm text-dark focus:border-primary focus:outline-none" defaultValue="DRAFT">
            <option>DRAFT</option><option>REVIEWED</option><option>PUBLISHED</option><option>UNPUBLISHED</option>
          </select>
        </FormField>
      </div>
      <div className="mt-6"><FormField label="마크다운 본문" required><MarkdownEditor value={markdown} onChange={onMarkdown} /></FormField></div>
      <div className="mt-6"><AttachmentUploadPanel compact /></div>
      <div className="mt-6 flex justify-end"><button className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primaryemphasis" onClick={onSave}>저장</button></div>
    </div>
  );
}
