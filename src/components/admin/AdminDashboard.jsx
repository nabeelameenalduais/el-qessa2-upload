import { useEffect } from 'react';
import { X } from 'lucide-react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import AdminOverview from './AdminOverview';
import AdminEvents from './AdminEvents';
import AdminWriters from './AdminWriters';
import AdminPublications from './AdminPublications';
import AdminWorkshops from './AdminWorkshops';
import AdminNews from './AdminNews';
import AdminArchive from './AdminArchive';
import AdminGallery from './AdminGallery';
import AdminFiles from './AdminFiles';
import AdminUsers from './AdminUsers';
import AdminRegistrations from './AdminRegistrations';
import AdminCosts from './CostManagement';
import SystemReport from './SystemReport';
import AdminSettings from './AdminSettings';
import AdminTasks from './AdminTasks';
import AccountSelect from './AccountSelect';

function AdminShell() {
  const { section, sidebarOpen, setSidebarOpen, settings, account, accountSelectOpen } =
    useAdmin();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [section]);

  if (!account || accountSelectOpen) {
    return <AccountSelect />;
  }

  const renderSection = () => {
    switch (section) {
      case 'events':
        return <AdminEvents />;
      case 'writers':
        return <AdminWriters />;
      case 'publications':
        return <AdminPublications />;
      case 'workshops':
        return <AdminWorkshops />;
      case 'news':
        return <AdminNews />;
      case 'archive':
        return <AdminArchive />;
      case 'gallery':
        return <AdminGallery />;
      case 'files':
        return <AdminFiles />;
      case 'users':
        return <AdminUsers />;
      case 'registrations':
        return <AdminRegistrations />;
      case 'costs':
        return <AdminCosts />;
      case 'reports':
        return <SystemReport />;
      case 'tasks':
        return <AdminTasks />;
      case 'settings':
        return <AdminSettings />;
      case 'overview':
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <aside
        className={`hidden lg:block sticky top-0 h-screen flex-shrink-0 transition-[width] duration-300 ${
          settings.collapsedSidebar ? 'w-[76px]' : 'w-64'
        }`}
      >
        <AdminSidebar collapsed={settings.collapsedSidebar} />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-ink/50 animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 w-[280px] animate-slide-in-right shadow-2xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-5 end-4 z-10 p-2 text-ivory/70 hover:text-ivory bg-ink/40 rounded-md transition-colors"
              aria-label="إغلاق القائمة"
            >
              <X size={20} />
            </button>
            <AdminSidebar collapsed={false} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{renderSection()}</main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminProvider>
      <AdminShell />
    </AdminProvider>
  );
}