import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { AdminMemberSummary } from '../../api/types';

interface Props {
  items: AdminMemberSummary[];
}

export default function MemberResultsTable({ items }: Props) {
  if (items.length === 0) {
    return <div className="notice">검색 결과가 없습니다.</div>;
  }

  return (
    <section className="surface-panel">
      <table className="data-table">
        <thead>
          <tr>
            <th>회원 ID</th>
            <th>닉네임</th>
            <th>상태</th>
            <th>역할</th>
            <th>인증</th>
            <th>가입일</th>
            <th aria-label="open" />
          </tr>
        </thead>
        <tbody>
          {items.map((member) => (
            <tr key={member.memberId}>
              <td>{member.memberId}</td>
              <td>{member.nickname}</td>
              <td>
                <span className={`status ${member.status === 'active' ? '' : 'warn'}`}>{member.status}</span>
              </td>
              <td>{member.roles.join(', ') || '-'}</td>
              <td>{member.verificationLevel}</td>
              <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
              <td>
                <Link className="button" to={`/cms/members/${member.memberId}`} aria-label={`${member.memberId} detail`}>
                  <ChevronRight size={16} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
