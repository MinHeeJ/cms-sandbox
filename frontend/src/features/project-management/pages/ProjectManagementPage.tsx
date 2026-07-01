import { useState } from 'react';
import { AdminLayout } from '../../../app/layout/AdminLayout';
import { ProjectTabs } from '../components/ProjectTabs';
import { ScheduleTable } from '../components/ScheduleTable';
import { RequirementTraceTable } from '../components/RequirementTraceTable';
import { ProjectMemberTable } from '../components/ProjectMemberTable';
import { RiskIssueTable } from '../components/RiskIssueTable';
import { DeliverableTable } from '../components/DeliverableTable';
import { ChangeRequestTable } from '../components/ChangeRequestTable';

export function ProjectManagementPage() {
  const [active, setActive] = useState('일정');
  const table = active === '일정' ? <ScheduleTable /> : active === '범위' ? <RequirementTraceTable /> : active === '인력' ? <ProjectMemberTable /> : active === '위험·이슈' ? <RiskIssueTable /> : active === '산출물' ? <DeliverableTable /> : <ChangeRequestTable />;
  return (
    <AdminLayout title="프로젝트관리">
      <div className="mb-6 overflow-hidden rounded-md border-0 bg-lightsecondary px-6 py-4">
        <h3 className="text-xl font-semibold text-dark">사업 수행 관리</h3>
        <p className="mt-2 text-sm font-medium text-bodytext">일정, 범위, 인력, 위험, 산출물, 변경 요청을 table/form 패턴으로 관리합니다.</p>
      </div>
      <section className="rounded-lg border border-ld bg-white p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div><h3 className="text-lg font-semibold text-dark">프로젝트 추적</h3><p className="mt-1 text-sm font-medium text-bodytext">탭마다 동일한 table interaction과 상태 badge를 사용합니다.</p></div>
          <button className="inline-flex h-10 items-center rounded-md bg-lightprimary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white">필터</button>
        </div>
        <ProjectTabs active={active} onChange={setActive} />
        <div className="mt-6">{table}</div>
      </section>
    </AdminLayout>
  );
}
