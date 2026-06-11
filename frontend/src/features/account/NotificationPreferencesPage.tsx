import { FormEvent, useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { NotificationPreferences } from '../../api/types';
import { getNotificationPreferences, updateNotificationPreferences } from './accountApi';

type PreferenceToggle = 'marketingEmailEnabled' | 'marketingSmsEnabled' | 'communityDigestEnabled';

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getNotificationPreferences()
      .then(setPreferences)
      .catch((caught) => setError(caught instanceof Error ? caught.message : '알림 설정을 불러오지 못했습니다.'));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!preferences) return;
    setMessage('');
    setError('');
    try {
      setPreferences(
        await updateNotificationPreferences({
          marketingEmailEnabled: preferences.marketingEmailEnabled,
          marketingSmsEnabled: preferences.marketingSmsEnabled,
          communityDigestEnabled: preferences.communityDigestEnabled
        })
      );
      setMessage('저장되었습니다.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '저장에 실패했습니다.');
    }
  }

  function update(key: PreferenceToggle, value: boolean) {
    setPreferences((current) => (current ? { ...current, [key]: value } : current));
  }

  return (
    <div className="surface">
      <div className="page-header">
        <div>
          <h1>알림 설정</h1>
          <p>서비스 공지는 항상 필요한 범위에서 유지됩니다.</p>
        </div>
      </div>
      <form className="surface-panel" onSubmit={submit}>
        <label className="checkbox-row">
          <input type="checkbox" checked={preferences?.serviceNoticesEnabled ?? true} disabled />
          <span>서비스 공지</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={preferences?.marketingEmailEnabled ?? false}
            onChange={(event) => update('marketingEmailEnabled', event.target.checked)}
          />
          <span>마케팅 이메일</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={preferences?.marketingSmsEnabled ?? false}
            onChange={(event) => update('marketingSmsEnabled', event.target.checked)}
          />
          <span>마케팅 SMS</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={preferences?.communityDigestEnabled ?? false}
            onChange={(event) => update('communityDigestEnabled', event.target.checked)}
          />
          <span>커뮤니티 다이제스트</span>
        </label>
        {message && <div className="notice">{message}</div>}
        {error && <div className="notice error">{error}</div>}
        <div className="actions">
          <button className="button primary" type="submit" disabled={!preferences}>
            <Save size={16} />
            <span>저장</span>
          </button>
        </div>
      </form>
    </div>
  );
}
