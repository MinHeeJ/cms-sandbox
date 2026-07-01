import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import { AdminContentPage } from '../../features/admin-content/pages/AdminContentPage';
import { PortalHomePage } from '../../features/portal-search/pages/PortalHomePage';
import { OperationsDashboardPage } from '../../features/operations/pages/OperationsDashboardPage';
import { DataManagementPage } from '../../features/data-management/pages/DataManagementPage';
import { ProjectManagementPage } from '../../features/project-management/pages/ProjectManagementPage';
import { AttachmentManagementPage } from '../../features/attachments/pages/AttachmentManagementPage';

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/content" replace />} />
        <Route path="/portal" element={<PortalHomePage />} />
        <Route path="/admin/content" element={<AdminContentPage />} />
        <Route path="/admin/attachments" element={<AttachmentManagementPage />} />
        <Route path="/admin/operations" element={<OperationsDashboardPage />} />
        <Route path="/admin/data" element={<DataManagementPage />} />
        <Route path="/admin/project" element={<ProjectManagementPage />} />
        <Route path="*" element={<Navigate to="/admin/content" replace />} />
      </Routes>
    </HashRouter>
  );
}
