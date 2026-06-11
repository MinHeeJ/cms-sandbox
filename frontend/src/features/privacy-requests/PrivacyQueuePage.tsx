import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { Page, PrivacyRequest } from '../../api/types';
import { searchPrivacyRequests } from './privacyRequestsApi';

export default function PrivacyQueuePage() {
  const [requestType, setRequestType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState<Page<PrivacyRequest>>();
  const [error, setError] = useState('');

  function load(filters = { requestType, status }) {
    setError('');
    searchPrivacyRequests(filters)
      .then(setPage)
      .catch((caught) => setError(caught instanceof Error ? caught.message : '개인정보 요청 검색에 실패했습니다.'));
  }

  useEffect(() => {
    load({ requestType: '', status: '' });
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    load();
  }

  return (
    <div className="surface">
      <div className="page-header">
        <div>
          <h1>개인정보 요청 큐</h1>
          <p>검토, 보류, 승인, 완료 상태를 관리합니다.</p>
        </div>
      </div>
      <form className="surface-panel" onSubmit={submit}>
        <div className="grid">
          <div className="field">
            <label htmlFor="requestType">유형</label>
            <select id="requestType" value={requestType} onChange={(event) => setRequestType(event.target.value)}>
              <option value="">전체</option>
              <option value="withdrawal">withdrawal</option>
              <option value="export">export</option>
              <option value="anonymization">anonymization</option>
              <option value="correction">correction</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="status">상태</label>
            <select id="status" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">전체</option>
              <option value="submitted">submitted</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
              <option value="on_hold">on_hold</option>
              <option value="completed">completed</option>
            </select>
          </div>
        </div>
        <div className="actions">
          <button className="button primary" type="submit">
            <Search size={16} />
            <span>검색</span>
          </button>
        </div>
      </form>
      {error && <div className="notice error">{error}</div>}
      <section className="surface-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>회원</th>
              <th>유형</th>
              <th>상태</th>
              <th>요청일</th>
              <th aria-label="open" />
            </tr>
          </thead>
          <tbody>
            {(page?.items ?? []).map((request) => (
              <tr key={request.privacyRequestId}>
                <td>{request.privacyRequestId}</td>
                <td>{request.memberId}</td>
                <td>{request.requestType}</td>
                <td>{request.status}</td>
                <td>{new Date(request.requestedAt).toLocaleDateString()}</td>
                <td>
                  <Link className="button" to={`/cms/privacy/${request.privacyRequestId}`}>
                    <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
