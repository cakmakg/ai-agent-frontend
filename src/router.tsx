import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import DashboardPage from './pages/dashboard-page';
import CrmPage from './pages/crm-page';
import EditorPage from './pages/editor-page';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: 'crm',
                element: <CrmPage />,
            },
            {
                path: 'editor/:id',
                element: <EditorPage />,
            },
        ],
    },
]);

export default router;
