import { DataTable } from '../../../shared/components/DataTable';

const rows = [{ source: 'local-import', total: 0, success: 0, failed: 0, duplicate: 0 }];
export function MigrationResultTable() {
  return <DataTable rows={rows} columns={[{ key: 'source', header: '원천', render: (row) => row.source }, { key: 'total', header: '총건', render: (row) => row.total }, { key: 'success', header: '성공', render: (row) => row.success }, { key: 'failed', header: '실패', render: (row) => row.failed }, { key: 'duplicate', header: '중복', render: (row) => row.duplicate }]} />;
}
