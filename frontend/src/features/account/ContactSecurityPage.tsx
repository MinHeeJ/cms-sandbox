import { FormEvent, useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { MemberAccount, VerificationChallenge } from '../../api/types';
import { getMyAccount, requestContactChange } from './accountApi';

export default function ContactSecurityPage() {
  const [account, setAccount] = useState<MemberAccount>();
  const [type, setType] = useState('email');
  const [newValue, setNewValue] = useState('');
  const [challenge, setChallenge] = useState<VerificationChallenge>();
  const [error, setError] = useState('');

  useEffect(() => {
    getMyAccount().then(setAccount).catch((caught) => setError(caught instanceof Error ? caught.message : '계정을 불러오지 못했습니다.'));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      setChallenge(await requestContactChange(type, newValue));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '인증 요청에 실패했습니다.');
    }
  }

  return (
    <div className="surface">
      <div className="page-header">
        <div>
          <h1>연락처 및 보안</h1>
          <p>{account ? `${account.memberId} · ${account.status}` : '계정 정보를 불러오는 중입니다.'}</p>
        </div>
      </div>
      <section className="surface-panel">
        <h2 className="section-title">등록된 연락처</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>유형</th>
              <th>값</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {(account?.contacts ?? []).map((contact) => (
              <tr key={contact.type}>
                <td>{contact.type}</td>
                <td>{contact.maskedValue}</td>
                <td>{contact.verificationStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <form className="surface-panel" onSubmit={submit}>
        <h2 className="section-title">연락처 변경 인증</h2>
        <div className="grid">
          <div className="field">
            <label htmlFor="type">유형</label>
            <select id="type" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="email">email</option>
              <option value="mobile">mobile</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="newValue">새 연락처</label>
            <input id="newValue" value={newValue} onChange={(event) => setNewValue(event.target.value)} required />
          </div>
        </div>
        {challenge && <div className="notice">인증 요청: {challenge.maskedDestination}</div>}
        {error && <div className="notice error">{error}</div>}
        <div className="actions">
          <button className="button primary" type="submit">
            <Send size={16} />
            <span>인증 요청</span>
          </button>
        </div>
      </form>
    </div>
  );
}
