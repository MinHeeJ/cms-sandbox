import { FormEvent, useState } from 'react';
import { BadgePlus } from 'lucide-react';
import { AdminMemberDetail } from '../../api/types';
import { replaceMemberRoles } from './adminMembersApi';

interface Props {
  detail: AdminMemberDetail;
  onChanged: () => void;
}

export default function RoleAssignmentPanel({ detail, onChanged }: Props) {
  const [roles, setRoles] = useState(detail.roles.map((role) => role.roleKey).join(', ') || 'member');
  const [reason, setReason] = useState('Operator-reviewed role update');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await replaceMemberRoles(detail.summary.memberId, {
        roles: roles.split(',').map((role) => role.trim()).filter(Boolean),
        reason,
        expectedVersion: detail.summary.version
      });
      onChanged();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '역할 변경에 실패했습니다.');
    }
  }

  return (
    <form className="surface-panel" onSubmit={submit}>
      <h2 className="section-title">역할 관리</h2>
      <div className="grid">
        <div className="field">
          <label htmlFor="roles">역할</label>
          <input id="roles" value={roles} onChange={(event) => setRoles(event.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="roleReason">사유</label>
          <input id="roleReason" value={reason} onChange={(event) => setReason(event.target.value)} minLength={5} required />
        </div>
      </div>
      {error && <div className="notice error">{error}</div>}
      <div className="actions">
        <button className="button primary" type="submit">
          <BadgePlus size={16} />
          <span>역할 저장</span>
        </button>
      </div>
    </form>
  );
}
