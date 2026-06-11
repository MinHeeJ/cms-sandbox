import { FormEvent, useEffect, useState } from 'react';
import { Send, ShieldCheck } from 'lucide-react';
import { Page, PrivacyRequest } from '../../api/types';
import { createMyPrivacyRequest, listMyPrivacyRequests, requestWithdrawal } from './privacyRequestsApi';

export default function PrivacyRequestWizard() {
  const [requests, setRequests] = useState<Page<PrivacyRequest>>();
  const [requestType, setRequestType] = useState('withdrawal');
  const [reason, setReason] = useState('Member requested privacy workflow');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function load() {
    listMyPrivacyRequests()
      .then(setRequests)
      .catch((caught) => setError(caught instanceof Error ? caught.message : '요청 목록을 불러오지 못했습니다.'));
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      if (requestType === 'withdrawal') {
        await requestWithdrawal(reason);
      } else {
        await createMyPrivacyRequest({ requestType, reason });
      }
      setMessage('요청이 접수되었습니다.');
      load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '요청 접수에 실패했습니다.');
    }
  }

  return (
    <div className="surface">
      <div className="page-header">
        <div>
          <h1>개인정보 요청</h1>
          <p>탈퇴, 내보내기, 정정, 익명화 요청을 접수합니다.</p>
        </div>
      </div>
      <form className="surface-panel" onSubmit={submit}>
        <div className="grid">
          <div className="field">
            <label htmlFor="requestType">요청 유형</label>
            <select id="requestType" value={requestType} onChange={(event) => setRequestType(event.target.value)}>
              <option value="withdrawal">withdrawal</option>
              <option value="export">export</option>
              <option value="anonymization">anonymization</option>
              <option value="correction">correction</option>
              <option value="retention_hold_review">retention_hold_review</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="reason">사유</label>
            <input id="reason" value={reason} onChange={(event) => setReason(event.target.value)} />
          </div>
        </div>
        {message && <div className="notice">{message}</div>}
        {error && <div className="notice error">{error}</div>}
        <div className="actions">
          <button className="button primary" type="submit">
            {requestType === 'withdrawal' ? <ShieldCheck size={16} /> : <Send size={16} />}
            <span>요청 제출</span>
          </button>
        </div>
      </form>
      <section className="surface-panel">
        <h2 className="section-title">내 요청</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>유형</th>
              <th>상태</th>
              <th>요청일</th>
            </tr>
          </thead>
          <tbody>
            {(requests?.items ?? []).map((request) => (
              <tr key={request.privacyRequestId}>
                <td>{request.privacyRequestId}</td>
                <td>{request.requestType}</td>
                <td>{request.status}</td>
                <td>{new Date(request.requestedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
