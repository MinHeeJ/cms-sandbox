import { Route } from 'react-router-dom';
import PrivacyRequestWizard from '../features/privacy-requests/PrivacyRequestWizard';
import PrivacyQueuePage from '../features/privacy-requests/PrivacyQueuePage';
import PrivacyDetailPage from '../features/privacy-requests/PrivacyDetailPage';

export const privacyRoutes = [
  <Route key="privacy" path="/privacy" element={<PrivacyRequestWizard />} />,
  <Route key="privacy-queue" path="/cms/privacy" element={<PrivacyQueuePage />} />,
  <Route key="privacy-detail" path="/cms/privacy/:privacyRequestId" element={<PrivacyDetailPage />} />
];
