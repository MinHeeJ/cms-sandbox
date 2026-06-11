import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, LockKeyhole, Pencil, ShieldCheck } from 'lucide-react';
import { MemberAccount } from '../../api/types';
import { getMyAccount } from './accountApi';

export default function AccountOverviewPage() {
  const [account, setAccount] = useState<MemberAccount>();
  const [error, setError] = useState('');

  useEffect(() => {
    getMyAccount().then(setAccount).catch((caught) => setError(caught instanceof Error ? caught.message : '계정을 불러오지 못했습니다.'));
  }, []);

  if (error) {
    return <div className="notice error">{error}</div>;
  }
  if (!account) {
    return <div className="notice">계정 정보를 불러오는 중입니다.</div>;
  }

  const email = account.contacts.find((contact) => contact.type === 'email');
  const mobile = account.contacts.find((contact) => contact.type === 'mobile');

  return (
    <div className="surface">
      <div className="page-header">
        <div>
          <h1>계정 개요</h1>
          <p>{account.memberId}</p>
        </div>
        <span className={`status ${account.status === 'active' ? '' : 'warn'}`}>{account.status}</span>
      </div>
      <section className="surface-panel">
        <h2 className="section-title">프로필</h2>
        <dl className="summary-list">
          <div>
            <dt>닉네임</dt>
            <dd>{account.profile.nickname}</dd>
          </div>
          <div>
            <dt>등급</dt>
            <dd>{account.profile.communityGrade}</dd>
          </div>
          <div>
            <dt>공개 범위</dt>
            <dd>{account.profile.profileVisibility}</dd>
          </div>
          <div>
            <dt>수정일</dt>
            <dd>{new Date(account.profile.updatedAt).toLocaleString()}</dd>
          </div>
        </dl>
        <div className="actions">
          <Link className="button" to="/account/profile">
            <Pencil size={16} />
            <span>프로필 수정</span>
          </Link>
        </div>
      </section>
      <section className="surface-panel">
        <h2 className="section-title">연락처 및 보안</h2>
        <dl className="summary-list">
          <div>
            <dt>이메일</dt>
            <dd>{email?.maskedValue ?? '-'}</dd>
          </div>
          <div>
            <dt>휴대폰</dt>
            <dd>{mobile?.maskedValue ?? '-'}</dd>
          </div>
          <div>
            <dt>알림</dt>
            <dd>{account.notificationPreferences.communityDigestEnabled ? 'digest enabled' : 'digest disabled'}</dd>
          </div>
          <div>
            <dt>버전</dt>
            <dd>{account.version}</dd>
          </div>
        </dl>
        <div className="actions">
          <Link className="button" to="/account/security">
            <LockKeyhole size={16} />
            <span>보안 관리</span>
          </Link>
          <Link className="button" to="/account/notifications">
            <Bell size={16} />
            <span>알림 설정</span>
          </Link>
          <Link className="button" to="/privacy">
            <ShieldCheck size={16} />
            <span>개인정보 요청</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
