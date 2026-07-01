import { DataTable } from '../../../shared/components/DataTable';
import { StatusBadge } from '../../../shared/components/StatusBadge';

const rows = [{ name: '인력 항목', status: 'SUCCESS', owner: 'PM', role: 'Backend' }];

export function ProjectMemberTable() {
  return <DataTable rows={rows} columns={[{ key: 'name', header: '항목', render: (row) => row.name }, { key: 'role', header: '역할', render: (row) => row.role }, { key: 'status', header: '커버리지', render: (row) => <StatusBadge status={row.status} /> }, { key: 'owner', header: '담당', render: (row) => row.owner }]} />;
}
