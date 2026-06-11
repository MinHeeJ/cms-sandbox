import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { ShieldCheck, UserPlus, UserRound, UsersRound } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { registrationRoutes } from '../routes/registrationRoutes';
import { accountRoutes } from '../routes/accountRoutes';
import { adminMemberRoutes } from '../routes/adminMemberRoutes';
import { privacyRoutes } from '../routes/privacyRoutes';

const navItems = [
  { to: '/register', label: '가입', icon: UserPlus },
  { to: '/account', label: '내 계정', icon: UserRound },
  { to: '/privacy', label: '개인정보', icon: ShieldCheck },
  { to: '/cms/members', label: '회원 CMS', icon: UsersRound },
  { to: '/cms/privacy', label: '개인정보 CMS', icon: ShieldCheck }
];

export default function App() {
  return (
    <ErrorBoundary>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-mark">MM</span>
            <span>Member Management</span>
          </div>
          <nav aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/register" replace />} />
            {registrationRoutes}
            {accountRoutes}
            {adminMemberRoutes}
            {privacyRoutes}
            <Route path="*" element={<Navigate to="/register" replace />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}
