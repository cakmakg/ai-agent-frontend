import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import DashboardPage from './pages/dashboard-page';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            // Faz 2'de eklenecek:
            // { path: 'crm', element: <CrmPage /> },
            // { path: 'editor/:id', element: <EditorPage /> },
            // Faz 3'te eklenecek:
            // { path: 'settings', element: <SettingsPage /> },
        ],
    },
]);

export default router;
