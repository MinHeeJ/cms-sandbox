import { DataTable } from '../../../shared/components/DataTable';
import { StatusBadge } from '../../../shared/components/StatusBadge';

const rows = [{ name: '범위 항목', status: 'IN_SCOPE', owner: 'PO', source: 'SPEC-REQUEST' }];

export function RequirementTraceTable() {
  return <DataTable rows={rows} columns={[{ key: 'name', header: '항목', render: (row) => row.name }, { key: 'status', header: '범위', render: (row) => <StatusBadge status={row.status} /> }, { key: 'owner', header: '담당', render: (row) => row.owner }, { key: 'source', header: '출처', render: (row) => row.source }]} />;
}
