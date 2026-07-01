import { DashboardCard } from '../../../shared/components/DashboardCard';

export function HealthStatusCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <DashboardCard title="Application" value="UP" tone="success" caption="마지막 확인 1분 전" />
      <DashboardCard title="PostgreSQL" value="UP" tone="success" caption="커넥션 정상" />
      <DashboardCard title="Storage" value="WARN" tone="warning" caption="업로드 지연 감지" />
    </div>
  );
}
