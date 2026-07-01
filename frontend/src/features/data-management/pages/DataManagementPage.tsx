import { AdminLayout } from '../../../app/layout/AdminLayout';
import { BackupPanel } from '../components/BackupPanel';
import { RestoreResultPanel } from '../components/RestoreResultPanel';
import { MigrationResultTable } from '../components/MigrationResultTable';

export function DataManagementPage() {
  return (
    <AdminLayout title="데이터관리">
      <div className="mb-6 overflow-hidden rounded-md border-0 bg-lightsecondary px-6 py-4">
        <h3 className="text-xl font-semibold text-dark">보존·백업·이관</h3>
        <p className="mt-2 text-sm font-medium text-bodytext">감사 이력, 백업, 복구, 이관 결과를 추적합니다.</p>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4"><BackupPanel /></div>
        <div className="col-span-12 lg:col-span-8"><RestoreResultPanel /></div>
        <section className="col-span-12 rounded-lg border border-ld bg-white p-6">
          <div className="mb-6"><h3 className="text-lg font-semibold text-dark">이관 오류 Table</h3><p className="mt-1 text-sm font-medium text-bodytext">성공, 실패, 중복 건수를 분리해서 확인합니다.</p></div>
          <MigrationResultTable />
        </section>
      </div>
    </AdminLayout>
  );
}
