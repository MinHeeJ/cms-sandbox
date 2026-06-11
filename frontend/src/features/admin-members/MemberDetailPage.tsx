import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AdminMemberDetail } from '../../api/types';
import { getAdminMemberDetail } from './adminMembersApi';
import StatusActionPanel from './StatusActionPanel';
import RoleAssignmentPanel from './RoleAssignmentPanel';
import RestrictionPanel from './RestrictionPanel';

export default function MemberDetailPage() {
  const { memberId = '' } = useParams();
  const [detail, setDetail] = useState<AdminMemberDetail>();
  const [error, setError] = useState('');

  function load() {
    getAdminMemberDetail(memberId)
      .then(setDetail)
      .catch((caught) => setError(caught instanceof Error ? caught.message : '회원 상세를 불러오지 못했습니다.'));
  }

  useEffect(() => {
    load();
  }, [memberId]);

  if (error) {
    return <div className="notice error">{error}</div>;
  }
  if (!detail) {
    return <div className="notice">회원 상세를 불러오는 중입니다.</div>;
  }

  return (
    <div className="surface">
      <div className="page-header">
        <div>
          <h1>회원 상세</h1>
          <p>{detail.summary.memberId}</p>
        </div>
        <span className={`status ${detail.summary.status === 'active' ? '' : 'warn'}`}>{detail.summary.status}</span>
      </div>
      <section className="surface-panel">
        <h2 className="section-title">요약</h2>
        <dl className="summary-list">
          <div>
            <dt>닉네임</dt>
            <dd>{detail.profile.nickname}</dd>
          </div>
          <div>
            <dt>연락처</dt>
            <dd>{detail.contacts.map((contact) => `${contact.type}: ${contact.maskedValue}`).join(' · ')}</dd>
          </div>
          <div>
            <dt>역할</dt>
            <dd>{detail.roles.map((role) => role.roleKey).join(', ') || '-'}</dd>
          </div>
          <div>
            <dt>버전</dt>
            <dd>{detail.summary.version}</dd>
          </div>
        </dl>
      </section>
      <StatusActionPanel detail={detail} onChanged={setDetail} />
      <RoleAssignmentPanel detail={detail} onChanged={load} />
      <RestrictionPanel detail={detail} onChanged={load} />
      <section className="surface-panel">
        <h2 className="section-title">최근 감사</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>시간</th>
              <th>행위자</th>
              <th>행동</th>
              <th>결과</th>
              <th>사유</th>
            </tr>
          </thead>
          <tbody>
            {detail.recentAuditEvents.map((event) => (
              <tr key={event.auditEventId}>
                <td>{new Date(event.createdAt).toLocaleString()}</td>
                <td>{event.actorId}</td>
                <td>{event.actionType}</td>
                <td>{event.outcome}</td>
                <td>{event.reason ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
