import { DataTable } from '../../../shared/components/DataTable';
import { StatusBadge } from '../../../shared/components/StatusBadge';

const rows = [{ name: 'Spring Boot', version: '3.3.5', status: 'SUCCESS', severity: 'LOW' }];

export function SoftwareComplianceTable() {
  return <DataTable rows={rows} columns={[{ key: 'name', header: '소프트웨어', render: (row) => row.name }, { key: 'version', header: '버전', render: (row) => row.version }, { key: 'status', header: '검토', render: (row) => <StatusBadge status={row.status} /> }, { key: 'severity', header: '취약점', render: (row) => <StatusBadge status={row.severity} /> }]} />;
}
