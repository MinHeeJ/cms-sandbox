import { FormEvent, useState } from 'react';
import { CheckCircle2, KeyRound } from 'lucide-react';
import { VerificationChallenge } from '../../api/types';
import { verifyRegistration } from './registrationApi';

interface Props {
  registrationId: string;
  challenge: VerificationChallenge;
  onVerified: (memberId: string) => void;
}

export default function VerificationPanel({ registrationId, challenge, onVerified }: Props) {
  const [verificationCode, setVerificationCode] = useState('123456');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const account = await verifyRegistration(registrationId, verificationCode);
      onVerified(account.memberId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '인증에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="surface-panel">
      <h2 className="section-title">연락처 인증</h2>
      <dl className="summary-list">
        <div>
          <dt>인증 대상</dt>
          <dd>{challenge.maskedDestination}</dd>
        </div>
        <div>
          <dt>남은 시도</dt>
          <dd>{challenge.remainingAttempts}</dd>
        </div>
      </dl>
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="verificationCode">인증 코드</label>
          <input
            id="verificationCode"
            value={verificationCode}
            onChange={(event) => setVerificationCode(event.target.value)}
            minLength={4}
            maxLength={12}
            required
          />
        </div>
        {error && <div className="notice error">{error}</div>}
        <div className="actions">
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? <KeyRound size={16} /> : <CheckCircle2 size={16} />}
            <span>인증 완료</span>
          </button>
        </div>
      </form>
    </section>
  );
}
