import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/layout/Layout';
import { useAuth } from './context/AuthContext';

// Activities
import ActivitiesList from './pages/activities/ActivitiesList';
import ActivityDetails from './pages/activities/ActivityDetails';
import ActivityForm from './pages/activities/ActivityForm';

// Leads
import LeadsList from './pages/leads/LeadsList';
import LeadDetails from './pages/leads/LeadDetails';
import LeadForm from './pages/leads/LeadForm';

// Contacts
import ContactsList from './pages/contacts/ContactsList';
import ContactDetails from './pages/contacts/ContactDetails';
import ContactForm from './pages/contacts/ContactForm';

// Project Setup
import ProjectSetupList from './pages/project-setup/ProjectSetupList';
import ProjectSetupDetails from './pages/project-setup/ProjectSetupDetails';
import ProjectSetupForm from './pages/project-setup/ProjectSetupForm';

// Setup
import SetupList from './pages/setup/SetupList';
import SetupDetails from './pages/setup/SetupDetails';
import SetupForm from './pages/setup/SetupForm';
import WebsiteAreasDetails from './pages/setup/website-areas/WebsiteAreasDetails';
import SlabRateDetails from './pages/setup/slab-rate/SlabRateDetails';
import DocumentCentre from './pages/setup/DocumentCentre';
import Countries from './pages/setup/Countries';
import States from './pages/setup/States';
import Cities from './pages/setup/Cities';

const PrivateRoute = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

const PublicRoute = () => {
  const { currentUser } = useAuth();
  return !currentUser ? <Outlet /> : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Private Route */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          {/* Activities */}
          <Route path="activities">
            <Route index element={<ActivitiesList />} />
            <Route path=":id" element={<ActivityDetails />} />
            <Route path="new" element={<ActivityForm />} />
            <Route path="edit/:id" element={<ActivityForm />} />
          </Route>

          {/* Leads */}
          <Route path="leads">
            <Route index element={<LeadsList />} />
            <Route path=":id" element={<LeadDetails />} />
            <Route path="new" element={<LeadForm />} />
            <Route path="edit/:id" element={<LeadForm />} />
          </Route>

          {/* Contacts */}
          <Route path="contacts">
            <Route index element={<ContactsList />} />
            <Route path=":id" element={<ContactDetails />} />
            <Route path="new" element={<ContactForm />} />
            <Route path="edit/:id" element={<ContactForm />} />
          </Route>

          {/* Project Setup */}
          <Route path="project-setup">
            <Route index element={<ProjectSetupList />} />
            <Route path=":id" element={<ProjectSetupDetails />} />
            <Route path="new" element={<ProjectSetupForm />} />
            <Route path="edit/:id" element={<ProjectSetupForm />} />
          </Route>

          {/* Setup */}
          <Route path="setup">
            <Route index element={<SetupList />} />
            <Route path=":id" element={<SetupDetails />} />
            <Route path="new" element={<SetupForm />} />
            <Route path="edit/:id" element={<SetupForm />} />
            <Route path="website-areas" element={<WebsiteAreasDetails />} />
            <Route path="slab-rate" element={<SlabRateDetails />} />
            <Route path="document-centre" element={<DocumentCentre />} />
            <Route path="countries" element={<Countries />} />
            <Route path="states" element={<States />} />
            <Route path="cities" element={<Cities />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all */}
      <Route
        path="*"
        element={<Navigate to={localStorage.getItem('user') ? '/' : '/login'} />}
      />
    </Routes>
  );
};

export default AppRoutes;
