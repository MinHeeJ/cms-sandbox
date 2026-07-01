import { AdminLayout } from '../../../app/layout/AdminLayout';
import { HealthStatusCards } from '../components/HealthStatusCards';
import { DeploymentTable } from '../components/DeploymentTable';
import { SoftwareComplianceTable } from '../components/SoftwareComplianceTable';

export function OperationsDashboardPage() {
  return (
    <AdminLayout title="운영관리">
      <div className="mb-6 overflow-hidden rounded-md border-0 bg-lightsecondary px-6 py-4">
        <h3 className="text-xl font-semibold text-dark">운영 Dashboard</h3>
        <p className="mt-2 text-sm font-medium text-bodytext">헬스, 배포 이력, 라이선스와 취약점 상태를 확인합니다.</p>
      </div>
      <div className="grid gap-6">
        <HealthStatusCards />
        <section className="rounded-lg border border-ld bg-white p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div><h3 className="text-lg font-semibold text-dark">배포 이력</h3><p className="mt-1 text-sm font-medium text-bodytext">빌드, 테스트 결과, 롤백 가능 여부를 추적합니다.</p></div>
            <button className="inline-flex h-10 items-center rounded-md bg-lightprimary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white">CSV 내보내기</button>
          </div>
          <DeploymentTable />
        </section>
        <section className="rounded-lg border border-ld bg-white p-6">
          <div className="mb-6"><h3 className="text-lg font-semibold text-dark">라이선스·취약점</h3><p className="mt-1 text-sm font-medium text-bodytext">검토 상태, 심각도, 조치 기한을 한 표에서 확인합니다.</p></div>
          <SoftwareComplianceTable />
        </section>
      </div>
    </AdminLayout>
  );
}
