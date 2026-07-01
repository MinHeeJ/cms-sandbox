export function FolderReorderPanel() {
  return (
    <div className="rounded-lg border border-ld bg-white p-6">
      <strong className="text-base font-semibold text-dark">정렬 기준</strong>
      <p className="mt-2 text-sm font-medium text-bodytext">동일 계층 표시 순서가 저장 후 포털에도 반영됩니다.</p>
      <div className="mt-4 rounded-md bg-lightsecondary px-4 py-3 text-sm font-semibold text-[#1679a8]">displayOrder 오름차순</div>
    </div>
  );
}
