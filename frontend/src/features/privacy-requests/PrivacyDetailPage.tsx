import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, PauseCircle } from 'lucide-react';
import { PrivacyRequest } from '../../api/types';
import { completePrivacyRequest, getPrivacyRequest, reviewPrivacyRequest } from './privacyRequestsApi';

export default function PrivacyDetailPage() {
  const { privacyRequestId = '' } = useParams();
  const [request, setRequest] = useState<PrivacyRequest>();
  const [decision, setDecision] = useState('approve');
  const [reason, setReason] = useState('Privacy manager reviewed request');
  const [evidenceRef, setEvidenceRef] = useState('evidence://member-privacy-result');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function load() {
    getPrivacyRequest(privacyRequestId)
      .then(setRequest)
      .catch((caught) => setError(caught instanceof Error ? caught.message : '요청 상세를 불러오지 못했습니다.'));
  }

  useEffect(() => {
    load();
  }, [privacyRequestId]);

  async function submitReview(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      setRequest(await reviewPrivacyRequest(privacyRequestId, { decision, reason, holdReason: decision === 'hold' ? reason : undefined }));
      setMessage('검토 결과가 저장되었습니다.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '검토 저장에 실패했습니다.');
    }
  }

  async function complete() {
    setError('');
    setMessage('');
    try {
      setRequest(await completePrivacyRequest(privacyRequestId, { completionNote: reason, evidenceRef }));
      setMessage('완료 처리되었습니다.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '완료 처리에 실패했습니다.');
    }
  }

  if (!request) {
    return <div className="notice">요청 상세를 불러오는 중입니다.</div>;
  }

  return (
    <div className="surface">
      <div className="page-header">
        <div>
          <h1>개인정보 요청 상세</h1>
          <p>{request.privacyRequestId}</p>
        </div>
        <span className="status">{request.status}</span>
      </div>
      <section className="surface-panel">
        <dl className="summary-list">
          <div>
            <dt>회원</dt>
            <dd>{request.memberId}</dd>
          </div>
          <div>
            <dt>유형</dt>
            <dd>{request.requestType}</dd>
          </div>
          <div>
            <dt>요청일</dt>
            <dd>{new Date(request.requestedAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt>증적</dt>
            <dd>{request.evidenceRef ?? '-'}</dd>
          </div>
        </dl>
      </section>
      <form className="surface-panel" onSubmit={submitReview}>
        <h2 className="section-title">검토</h2>
        <div className="grid">
          <div className="field">
            <label htmlFor="decision">결정</label>
            <select id="decision" value={decision} onChange={(event) => setDecision(event.target.value)}>
              <option value="approve">approve</option>
              <option value="reject">reject</option>
              <option value="hold">hold</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="reason">사유</label>
            <input id="reason" value={reason} onChange={(event) => setReason(event.target.value)} minLength={5} required />
          </div>
        </div>
        <div className="actions">
          <button className="button primary" type="submit">
            <PauseCircle size={16} />
            <span>검토 저장</span>
          </button>
        </div>
      </form>
      <section className="surface-panel">
        <h2 className="section-title">완료</h2>
        <div className="field">
          <label htmlFor="evidenceRef">증적 참조</label>
          <input id="evidenceRef" value={evidenceRef} onChange={(event) => setEvidenceRef(event.target.value)} />
        </div>
        {message && <div className="notice">{message}</div>}
        {error && <div className="notice error">{error}</div>}
        <div className="actions">
          <button className="button primary" type="button" onClick={complete}>
            <CheckCircle2 size={16} />
            <span>완료 처리</span>
          </button>
        </div>
      </section>
    </div>
  );
}
