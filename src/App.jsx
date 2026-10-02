import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import EventsPage from './components/EventsPage';
import EventDetailPage from './components/EventDetailPage';
import WritersPage from './components/WritersPage';
import WriterDetailPage from './components/WriterDetailPage';
import PublicationsPage from './components/PublicationsPage';
import PublicationDetailPage from './components/PublicationDetailPage';
import WorkshopsPage from './components/WorkshopsPage';
import NewsPage from './components/NewsPage';
import NewsDetailPage from './components/NewsDetailPage';
import ArchivePage from './components/ArchivePage';
import GalleryPage from './components/GalleryPage';
import ContactPage from './components/ContactPage';
import MyPage from './components/MyPage';
import NotFoundPage from './components/NotFoundPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminGate from './components/AdminGate';
import AdminDashboard from './components/admin/AdminDashboard';
import Toast from './components/Toast';
import Lightbox from './components/Lightbox';
import RegistrationModal from './components/RegistrationModal';

function AppContent() {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'events':
        return <EventsPage />;
      case 'event-detail':
        return <EventDetailPage />;
      case 'writers':
        return <WritersPage />;
      case 'writer-detail':
        return <WriterDetailPage />;
      case 'publications':
        return <PublicationsPage />;
      case 'publication-detail':
        return <PublicationDetailPage />;
      case 'workshops':
        return <WorkshopsPage />;
      case 'news':
        return <NewsPage />;
      case 'news-detail':
        return <NewsDetailPage />;
      case 'archive':
        return <ArchivePage />;
      case 'gallery':
        return <GalleryPage />;
      case 'contact':
        return <ContactPage />;
      case 'my-account':
        return <MyPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'admin':
        return (
          <AdminGate>
            <AdminDashboard />
          </AdminGate>
        );
      default:
        return <NotFoundPage />;
    }
  };

  const isStandalone = currentPage === 'admin' || currentPage === 'login' || currentPage === 'register';

  return (
    <div className="min-h-screen bg-surface font-sans flex flex-col">
      {isStandalone ? (
        <main className="flex-1">{renderPage()}</main>
      ) : (
        <>
          <Navbar />
          <main className="flex-1">{renderPage()}</main>
          <Footer />
        </>
      )}
      <Toast />
      <Lightbox />
      <RegistrationModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}