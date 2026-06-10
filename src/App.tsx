import { Navigate, Route, Routes } from "react-router-dom";
import { GuestRoute } from "./Components/GuestRoute";
import { AdminRoute } from "./Components/AdminRoute";
import { VolunteerRoute } from "./Components/VolunteerRoute";
import { VisuallyImpairedRoute } from "./Components/VisuallyImpairedRoute";
import { CoordinatorRoute } from "./Components/CoordinatorRoute";
import { PublicLayout } from "./Components/layout/PublicLayout";
import { AdminLayout } from "./Components/layout/AdminLayout";
import { VolunteerLayout } from "./Components/layout/VolunteerLayout";
import { VisuallyImpairedLayout } from "./Components/layout/VisuallyImpairedLayout";
import { CoordinatorLayout } from "./Components/layout/CoordinatorLayout";

// Public pages
import Home from "./Pages/public/Home";
import About from "./Pages/public/About";
import Contact from "./Pages/public/Contact";

// Admin pages
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminRequests from "./Pages/admin/AdminRequests";
import AdminVolunteers from "./Pages/admin/AdminVolunteers";
import AdminLibrary from "./Pages/admin/AdminLibrary";
import AdminSettings from "./Pages/admin/AdminSettings";

// Volunteer pages
import VolunteerDashboard from "./Pages/volunteer/VolunteerDashboard";
import VolunteerOpportunities from "./Pages/volunteer/VolunteerOpportunities";
import VolunteerWorkRequests from "./Pages/volunteer/VolunteerWorkRequests";

// Visually impaired pages
import VIDashboard from "./Pages/visually-impaired/VIDashboard";
import VILibrary from "./Pages/visually-impaired/VILibrary";
import VIRequestHelp from "./Pages/visually-impaired/VIRequestHelp";
import CoordinatorDashboard from "./Pages/coordinator/CoordinatorDashboard";
import CoordinatorRequests from "./Pages/coordinator/CoordinatorRequests";
import CoordinatorReservations from "./Pages/coordinator/CoordinatorReservations";

// Auth
import Login from "./Pages/login";
import Signup from "./Pages/signup";

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
        <Route element={<GuestRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/about" element={<About />} />
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
          <Route path="/volunteer-dashboard/library" element={<VILibrary />} />
          <Route
            path="/volunteer-dashboard/opportunities"
            element={<VolunteerOpportunities />}
          />
          <Route
            path="/volunteer-dashboard/work-requests"
            element={<VolunteerWorkRequests />}
          />
        </Route>
      </Route>

      {/* Coordinator dashboard */}
      <Route element={<CoordinatorRoute />}>
        <Route element={<CoordinatorLayout />}>
          <Route path="/coordinator" element={<CoordinatorDashboard />} />
          <Route path="/coordinator/requests" element={<CoordinatorRequests />} />
          <Route
            path="/coordinator/reservations"
            element={<CoordinatorReservations />}
          />
        </Route>
      </Route>

      {/* Visually impaired dashboard */}
      <Route element={<VisuallyImpairedRoute />}>
        <Route element={<VisuallyImpairedLayout />}>
          <Route path="/vi" element={<VIDashboard />} />
          <Route path="/vi/library" element={<VILibrary />} />
          <Route path="/vi/requests" element={<VIRequestHelp />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
