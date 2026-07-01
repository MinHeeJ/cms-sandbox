import { DataTable } from '../../../shared/components/DataTable';
import { StatusBadge } from '../../../shared/components/StatusBadge';

const rows = [{ version: '0.1.0', commit: 'local', build: 'B-001', test: 'SUCCESS', rollback: '가능' }];

export function DeploymentTable() {
  return <DataTable rows={rows} columns={[{ key: 'version', header: '버전', render: (row) => row.version }, { key: 'commit', header: '커밋', render: (row) => row.commit }, { key: 'build', header: '빌드', render: (row) => row.build }, { key: 'test', header: '테스트', render: (row) => <StatusBadge status={row.test} /> }, { key: 'rollback', header: '롤백', render: (row) => row.rollback }]} />;
}
