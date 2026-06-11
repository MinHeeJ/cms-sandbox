import { Route } from 'react-router-dom';
import AccountOverviewPage from '../features/account/AccountOverviewPage';
import ProfileEditor from '../features/account/ProfileEditor';
import ContactSecurityPage from '../features/account/ContactSecurityPage';
import NotificationPreferencesPage from '../features/account/NotificationPreferencesPage';

export const accountRoutes = [
  <Route key="account" path="/account" element={<AccountOverviewPage />} />,
  <Route key="account-profile" path="/account/profile" element={<ProfileEditor />} />,
  <Route key="account-security" path="/account/security" element={<ContactSecurityPage />} />,
  <Route key="account-notifications" path="/account/notifications" element={<NotificationPreferencesPage />} />
];
