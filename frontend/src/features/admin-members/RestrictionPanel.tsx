import { FormEvent, useState } from 'react';
import { Ban, CheckCircle2 } from 'lucide-react';
import { AdminMemberDetail } from '../../api/types';
import { applyRestriction, updateRestriction } from './adminMembersApi';

interface Props {
  detail: AdminMemberDetail;
  onChanged: () => void;
}

export default function RestrictionPanel({ detail, onChanged }: Props) {
  const [restrictionType, setRestrictionType] = useState('posting');
  const [reasonCode, setReasonCode] = useState('policy_violation');
  const [reasonText, setReasonText] = useState('Operator-reviewed community restriction');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await applyRestriction(detail.summary.memberId, {
        restrictionType,
        reasonCode,
        reasonText,
        startsAt: new Date().toISOString()
      });
      onChanged();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '제한 적용에 실패했습니다.');
    }
  }

  async function lift(restrictionId: string) {
    setError('');
    try {
      await updateRestriction(detail.summary.memberId, restrictionId, { status: 'lifted', reasonText: 'Operator-reviewed restriction lift' });
      onChanged();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '제한 해제에 실패했습니다.');
    }
  }

  return (
    <section className="surface-panel">
      <h2 className="section-title">제한 관리</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>유형</th>
            <th>상태</th>
            <th>사유</th>
            <th aria-label="actions" />
          </tr>
        </thead>
        <tbody>
          {detail.restrictions.map((restriction) => (
            <tr key={restriction.restrictionId}>
              <td>{restriction.restrictionType}</td>
              <td>{restriction.status}</td>
              <td>{restriction.reasonText}</td>
              <td>
                {restriction.status === 'active' && (
                  <button className="button" type="button" onClick={() => lift(restriction.restrictionId)}>
                    <CheckCircle2 size={16} />
                    <span>해제</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={submit}>
        <div className="grid">
          <div className="field">
            <label htmlFor="restrictionType">제한 유형</label>
            <select id="restrictionType" value={restrictionType} onChange={(event) => setRestrictionType(event.target.value)}>
              <option value="posting">posting</option>
              <option value="commenting">commenting</option>
              <option value="messaging">messaging</option>
              <option value="profile_edit">profile_edit</option>
              <option value="full_account">full_account</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="reasonCode">사유 코드</label>
            <input id="reasonCode" value={reasonCode} onChange={(event) => setReasonCode(event.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="reasonText">사유</label>
          <input id="reasonText" value={reasonText} onChange={(event) => setReasonText(event.target.value)} minLength={5} required />
        </div>
        {error && <div className="notice error">{error}</div>}
        <div className="actions">
          <button className="button primary" type="submit">
            <Ban size={16} />
            <span>제한 적용</span>
          </button>
        </div>
      </form>
    </section>
  );
}
