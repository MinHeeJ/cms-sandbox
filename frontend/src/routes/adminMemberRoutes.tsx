import { Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MemberSearchFilters from '../features/admin-members/MemberSearchFilters';
import MemberResultsTable from '../features/admin-members/MemberResultsTable';
import MemberDetailPage from '../features/admin-members/MemberDetailPage';
import { MemberSearchFilters as Filters, searchMembers } from '../features/admin-members/adminMembersApi';
import { AdminMemberSummary, Page } from '../api/types';

function MemberSearchPage() {
  const [results, setResults] = useState<Page<AdminMemberSummary>>();
  const [error, setError] = useState('');

  function runSearch(filters: Filters) {
    setError('');
    searchMembers(filters)
      .then(setResults)
      .catch((caught) => setError(caught instanceof Error ? caught.message : '회원 검색에 실패했습니다.'));
  }

  useEffect(() => {
    runSearch({ memberId: 'M-1000' });
  }, []);

  return (
    <div className="surface">
      <div className="page-header">
        <div>
          <h1>회원 검색</h1>
          <p>식별자, 닉네임, 연락처 힌트, 상태, 역할로 회원을 찾습니다.</p>
        </div>
      </div>
      <MemberSearchFilters onSearch={runSearch} />
      {error && <div className="notice error">{error}</div>}
      {results && <MemberResultsTable items={results.items} />}
    </div>
  );
}

export const adminMemberRoutes = [
  <Route key="admin-members" path="/cms/members" element={<MemberSearchPage />} />,
  <Route key="admin-member-detail" path="/cms/members/:memberId" element={<MemberDetailPage />} />
];
