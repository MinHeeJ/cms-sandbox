import { DataTable } from '../../../shared/components/DataTable';
import { StatusBadge } from '../../../shared/components/StatusBadge';

const rows = [{ name: '변경요청 항목', status: 'REVIEW_REQUIRED', owner: 'PM', impact: '영향 분석 필요' }];

export function ChangeRequestTable() {
  return <DataTable rows={rows} columns={[{ key: 'name', header: '항목', render: (row) => row.name }, { key: 'impact', header: '영향', render: (row) => row.impact }, { key: 'status', header: '승인', render: (row) => <StatusBadge status={row.status} /> }, { key: 'owner', header: '담당', render: (row) => row.owner }]} />;
}
