import { FormEvent, useState } from 'react';
import { Send, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RegistrationResponse } from '../../api/types';
import VerificationPanel from './VerificationPanel';
import { RegistrationPayload, startRegistration } from './registrationApi';

const defaultConsents = [
  { consentType: 'terms', label: '서비스 이용약관', required: true },
  { consentType: 'privacy', label: '개인정보 처리방침', required: true },
  { consentType: 'age', label: '연령 및 자격 확인', required: true },
  { consentType: 'marketing', label: '마케팅 수신', required: false }
];

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [contactType, setContactType] = useState<'email' | 'mobile'>('email');
  const [contactValue, setContactValue] = useState('new-member@example.com');
  const [nickname, setNickname] = useState('seoul-river');
  const [password, setPassword] = useState('password1234');
  const [consents, setConsents] = useState<Record<string, boolean>>({ terms: true, privacy: true, age: true });
  const [registration, setRegistration] = useState<RegistrationResponse>();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const payload: RegistrationPayload = {
      contactType,
      contactValue,
      nickname,
      password,
      consents: defaultConsents.map((consent) => ({
        consentType: consent.consentType,
        policyVersion: '2026-01',
        granted: Boolean(consents[consent.consentType])
      }))
    };
    try {
      setRegistration(await startRegistration(payload));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '가입 요청에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  if (registration) {
    return (
      <div className="surface">
        <div className="page-header">
          <div>
            <h1>회원 가입</h1>
            <p>인증 완료 후 활성 회원으로 전환됩니다.</p>
          </div>
        </div>
        <VerificationPanel
          registrationId={registration.registrationId}
          challenge={registration.verificationChallenge}
          onVerified={(memberId) => navigate(`/registration/complete?memberId=${encodeURIComponent(memberId)}`)}
        />
      </div>
    );
  }

  return (
    <div className="surface">
      <div className="page-header">
        <div>
          <h1>회원 가입</h1>
          <p>연락처 인증과 필수 동의를 완료한 뒤 계정이 생성됩니다.</p>
        </div>
      </div>
      <form className="surface-panel" onSubmit={submit}>
        <div className="grid">
          <div className="field">
            <label htmlFor="contactType">연락처 유형</label>
            <select id="contactType" value={contactType} onChange={(event) => setContactType(event.target.value as 'email' | 'mobile')}>
              <option value="email">이메일</option>
              <option value="mobile">휴대폰</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="contactValue">연락처</label>
            <input id="contactValue" value={contactValue} onChange={(event) => setContactValue(event.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="nickname">닉네임</label>
            <input id="nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} minLength={2} maxLength={20} required />
          </div>
          <div className="field">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              minLength={10}
              required
            />
          </div>
        </div>
        <h2 className="section-title">동의</h2>
        {defaultConsents.map((consent) => (
          <label className="checkbox-row" key={consent.consentType}>
            <input
              type="checkbox"
              checked={Boolean(consents[consent.consentType])}
              onChange={(event) => setConsents((current) => ({ ...current, [consent.consentType]: event.target.checked }))}
            />
            <span>
              {consent.label}
              {consent.required ? ' (필수)' : ' (선택)'}
            </span>
          </label>
        ))}
        {error && <div className="notice error">{error}</div>}
        <div className="actions">
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? <Send size={16} /> : <UserPlus size={16} />}
            <span>가입 요청</span>
          </button>
        </div>
      </form>
    </div>
  );
}
