import { DataTable } from '../../../shared/components/DataTable';
import { StatusBadge } from '../../../shared/components/StatusBadge';

const rows = [{ name: '위험·이슈 항목', status: 'HIGH', owner: 'PM', action: '완화 계획' }];

export function RiskIssueTable() {
  return <DataTable rows={rows} columns={[{ key: 'name', header: '항목', render: (row) => row.name }, { key: 'status', header: '심각도', render: (row) => <StatusBadge status={row.status} /> }, { key: 'owner', header: '담당', render: (row) => row.owner }, { key: 'action', header: '조치', render: (row) => row.action }]} />;
}
