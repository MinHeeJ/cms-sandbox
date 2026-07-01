import { DataTable } from '../../../shared/components/DataTable';
import { StatusBadge } from '../../../shared/components/StatusBadge';

const rows = [{ name: '산출물 항목', status: 'REVIEWED', owner: 'PM', version: 'v1' }];

export function DeliverableTable() {
  return <DataTable rows={rows} columns={[{ key: 'name', header: '항목', render: (row) => row.name }, { key: 'version', header: '버전', render: (row) => row.version }, { key: 'status', header: '승인', render: (row) => <StatusBadge status={row.status} /> }, { key: 'owner', header: '담당', render: (row) => row.owner }]} />;
}
