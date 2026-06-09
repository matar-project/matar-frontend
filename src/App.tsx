import { Navigate, Route, Routes } from 'react-router-dom';
import { GuestRoute } from './Components/GuestRoute';
import { AdminRoute } from './Components/AdminRoute';
import { PublicLayout } from './Components/layout/PublicLayout';
import { AdminLayout } from './Components/layout/AdminLayout';

// Public pages
import Home from './Pages/public/Home';
import About from './Pages/public/About';
import RequestHelp from './Pages/public/RequestHelp';
import BookRequest from './Pages/public/BookRequest';
import Volunteer from './Pages/public/Volunteer';
import Opportunities from './Pages/public/Opportunities';
import Library from './Pages/public/Library';
import Contact from './Pages/public/Contact';

// Admin pages
import AdminDashboard from './Pages/admin/AdminDashboard';
import AdminRequests from './Pages/admin/AdminRequests';
import AdminVolunteers from './Pages/admin/AdminVolunteers';
import AdminLibrary from './Pages/admin/AdminLibrary';
import AdminSettings from './Pages/admin/AdminSettings';

// Auth
import Login from './Pages/login';

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Public website */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/request-help" element={<RequestHelp />} />
        <Route path="/book-request" element={<BookRequest />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/library" element={<Library />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin dashboard */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/admin/volunteers" element={<AdminVolunteers />} />
          <Route path="/admin/library" element={<AdminLibrary />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
