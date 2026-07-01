export function BackupPanel() {
  return (
    <div className="h-full rounded-lg border border-ld bg-white p-6">
      <h3 className="text-lg font-semibold text-dark">수동 백업</h3>
      <p className="mt-2 text-sm font-medium text-bodytext">DB와 파일 저장소 범위를 기록하고 결과를 보존합니다.</p>
      <div className="my-6 rounded-md bg-lightprimary px-4 py-3 text-sm font-semibold text-primary">대상: PostgreSQL + 파일 저장소</div>
      <button className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primaryemphasis">백업 실행</button>
    </div>
  );
}
