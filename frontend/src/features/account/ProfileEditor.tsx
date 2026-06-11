import { FormEvent, useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { MemberAccount } from '../../api/types';
import { getMyAccount, updateMyProfile } from './accountApi';

export default function ProfileEditor() {
  const [account, setAccount] = useState<MemberAccount>();
  const [nickname, setNickname] = useState('');
  const [avatarAssetRef, setAvatarAssetRef] = useState('');
  const [bio, setBio] = useState('');
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getMyAccount()
      .then((loaded) => {
        setAccount(loaded);
        setNickname(loaded.profile.nickname);
        setAvatarAssetRef(loaded.profile.avatarAssetRef ?? '');
        setBio(loaded.profile.bio ?? '');
        setProfileVisibility(loaded.profile.profileVisibility);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : '프로필을 불러오지 못했습니다.'));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!account) return;
    setError('');
    setMessage('');
    try {
      const updated = await updateMyProfile({
        nickname,
        avatarAssetRef: avatarAssetRef || null,
        bio,
        profileVisibility,
        version: account.version
      });
      setAccount(updated);
      setMessage('저장되었습니다.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '저장에 실패했습니다.');
    }
  }

  return (
    <div className="surface">
      <div className="page-header">
        <div>
          <h1>프로필 수정</h1>
          <p>활성 회원 상태에서 공개 프로필을 관리합니다.</p>
        </div>
      </div>
      <form className="surface-panel" onSubmit={submit}>
        <div className="grid">
          <div className="field">
            <label htmlFor="nickname">닉네임</label>
            <input id="nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} minLength={2} maxLength={20} required />
          </div>
          <div className="field">
            <label htmlFor="avatar">아바타 참조</label>
            <input id="avatar" value={avatarAssetRef} onChange={(event) => setAvatarAssetRef(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="visibility">공개 범위</label>
            <select id="visibility" value={profileVisibility} onChange={(event) => setProfileVisibility(event.target.value)}>
              <option value="public">public</option>
              <option value="members_only">members_only</option>
              <option value="private">private</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="bio">소개</label>
          <textarea id="bio" value={bio} onChange={(event) => setBio(event.target.value)} maxLength={500} />
        </div>
        {message && <div className="notice">{message}</div>}
        {error && <div className="notice error">{error}</div>}
        <div className="actions">
          <button className="button primary" type="submit" disabled={!account}>
            <Save size={16} />
            <span>저장</span>
          </button>
        </div>
      </form>
    </div>
  );
}
