import { FormEvent, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { AdminMemberDetail } from '../../api/types';
import { changeMemberStatus } from './adminMembersApi';

interface Props {
  detail: AdminMemberDetail;
  onChanged: (detail: AdminMemberDetail) => void;
}

export default function StatusActionPanel({ detail, onChanged }: Props) {
  const [targetStatus, setTargetStatus] = useState(detail.summary.status);
  const [reason, setReason] = useState('Operator-reviewed lifecycle change');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      onChanged(await changeMemberStatus(detail.summary.memberId, { targetStatus, reason, expectedVersion: detail.summary.version }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '상태 변경에 실패했습니다.');
    }
  }

  return (
    <form className="surface-panel" onSubmit={submit}>
      <h2 className="section-title">상태 변경</h2>
      <div className="grid">
        <div className="field">
          <label htmlFor="targetStatus">대상 상태</label>
          <select id="targetStatus" value={targetStatus} onChange={(event) => setTargetStatus(event.target.value)}>
            <option value="active">active</option>
            <option value="dormant">dormant</option>
            <option value="suspended">suspended</option>
            <option value="withdrawn">withdrawn</option>
            <option value="anonymized">anonymized</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="statusReason">사유</label>
          <input id="statusReason" value={reason} onChange={(event) => setReason(event.target.value)} minLength={5} required />
        </div>
      </div>
      {error && <div className="notice error">{error}</div>}
      <div className="actions">
        <button className="button primary" type="submit">
          <ShieldAlert size={16} />
          <span>상태 저장</span>
        </button>
      </div>
    </form>
  );
}
