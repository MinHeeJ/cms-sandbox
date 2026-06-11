import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, UserRound } from 'lucide-react';

export default function RegistrationCompletePage() {
  const [params] = useSearchParams();
  const memberId = params.get('memberId') ?? localStorage.getItem('memberId');

  return (
    <div className="surface">
      <div className="page-header">
        <div>
          <h1>가입 완료</h1>
          <p>활성 회원 상태로 계정이 생성되었습니다.</p>
        </div>
        <span className="status">active</span>
      </div>
      <section className="surface-panel">
        <dl className="summary-list">
          <div>
            <dt>회원 ID</dt>
            <dd>{memberId}</dd>
          </div>
          <div>
            <dt>다음 화면</dt>
            <dd>계정 개요</dd>
          </div>
        </dl>
        <div className="actions">
          <Link className="button primary" to="/account">
            <UserRound size={16} />
            <span>내 계정</span>
          </Link>
          <Link className="button" to="/cms/members">
            <CheckCircle2 size={16} />
            <span>CMS 확인</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
