import { Navigate, Route, Routes } from 'react-router-dom';
import { GuestRoute } from './Components/GuestRoute';
import { AdminRoute } from './Components/AdminRoute';
import { VolunteerRoute } from './Components/VolunteerRoute';
import { VisuallyImpairedRoute } from './Components/VisuallyImpairedRoute';
import { PublicLayout } from './Components/layout/PublicLayout';
import { AdminLayout } from './Components/layout/AdminLayout';
import { VolunteerLayout } from './Components/layout/VolunteerLayout';
import { VisuallyImpairedLayout } from './Components/layout/VisuallyImpairedLayout';

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

// Volunteer pages
import VolunteerDashboard from './Pages/volunteer/VolunteerDashboard';
import VolunteerOpportunities from './Pages/volunteer/VolunteerOpportunities';

// Visually impaired pages
import VIDashboard from './Pages/visually-impaired/VIDashboard';
import VILibrary from './Pages/visually-impaired/VILibrary';

// Auth
import Login from './Pages/login';
import Signup from './Pages/signup';

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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

      {/* Volunteer dashboard */}
      <Route element={<VolunteerRoute />}>
        <Route element={<VolunteerLayout />}>
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
          <Route path="/volunteer-dashboard/opportunities" element={<VolunteerOpportunities />} />
        </Route>
      </Route>

      {/* Visually impaired dashboard */}
      <Route element={<VisuallyImpairedRoute />}>
        <Route element={<VisuallyImpairedLayout />}>
          <Route path="/vi" element={<VIDashboard />} />
          <Route path="/vi/library" element={<VILibrary />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
