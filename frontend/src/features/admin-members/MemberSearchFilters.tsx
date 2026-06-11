import { FormEvent, useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { MemberSearchFilters as Filters } from './adminMembersApi';

interface Props {
  onSearch: (filters: Filters) => void;
}

export default function MemberSearchFilters({ onSearch }: Props) {
  const [filters, setFilters] = useState<Filters>({ memberId: 'M-1000' });

  function setField(key: keyof Filters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onSearch(filters);
  }

  return (
    <form className="surface-panel" onSubmit={submit}>
      <div className="grid three">
        <div className="field">
          <label htmlFor="memberId">회원 ID</label>
          <input id="memberId" value={filters.memberId ?? ''} onChange={(event) => setField('memberId', event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="nickname">닉네임</label>
          <input id="nickname" value={filters.nickname ?? ''} onChange={(event) => setField('nickname', event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="contactHint">연락처 힌트</label>
          <input id="contactHint" value={filters.contactHint ?? ''} onChange={(event) => setField('contactHint', event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="status">상태</label>
          <select id="status" value={filters.status ?? ''} onChange={(event) => setField('status', event.target.value)}>
            <option value="">전체</option>
            <option value="active">active</option>
            <option value="dormant">dormant</option>
            <option value="suspended">suspended</option>
            <option value="withdrawn">withdrawn</option>
            <option value="anonymized">anonymized</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="role">역할</label>
          <input id="role" value={filters.role ?? ''} onChange={(event) => setField('role', event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="verificationLevel">인증 수준</label>
          <select id="verificationLevel" value={filters.verificationLevel ?? ''} onChange={(event) => setField('verificationLevel', event.target.value)}>
            <option value="">전체</option>
            <option value="none">none</option>
            <option value="contact">contact</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="registeredFrom">가입 시작일</label>
          <input id="registeredFrom" type="date" value={filters.registeredFrom ?? ''} onChange={(event) => setField('registeredFrom', event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="registeredTo">가입 종료일</label>
          <input id="registeredTo" type="date" value={filters.registeredTo ?? ''} onChange={(event) => setField('registeredTo', event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="restrictionState">제한 상태</label>
          <select id="restrictionState" value={filters.restrictionState ?? ''} onChange={(event) => setField('restrictionState', event.target.value)}>
            <option value="">전체</option>
            <option value="active">active</option>
            <option value="expired">expired</option>
            <option value="lifted">lifted</option>
          </select>
        </div>
      </div>
      <div className="actions">
        <button className="button primary" type="submit">
          <Search size={16} />
          <span>검색</span>
        </button>
        <button className="button" type="button" onClick={() => setFilters({})}>
          <RotateCcw size={16} />
          <span>초기화</span>
        </button>
      </div>
    </form>
  );
}
