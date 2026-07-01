import { DataTable } from '../../../shared/components/DataTable';
import { StatusBadge } from '../../../shared/components/StatusBadge';

const rows = [{ name: '일정 항목', status: 'REVIEW_REQUIRED', owner: 'PM', due: '2026-07-15' }];

export function ScheduleTable() {
  return <DataTable rows={rows} columns={[{ key: 'name', header: '항목', render: (row) => row.name }, { key: 'status', header: '상태', render: (row) => <StatusBadge status={row.status} /> }, { key: 'owner', header: '담당', render: (row) => row.owner }, { key: 'due', header: '기한', render: (row) => row.due }]} />;
}
