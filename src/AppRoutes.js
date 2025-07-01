// File: src/AppRoutes.jsx

import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth
import Login from './pages/auth/Login';

// Layout
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';

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
import WebsiteAreasDetails from './pages/setup/WebsiteAreas';

import DocumentCentre from './pages/setup/DocumentCentre';
import Organisation from './pages/setup/Organisation';
import WebsitePanel from './pages/setup/WebsitePanel';
import VirtualNumber from './pages/setup/VirtualNumber';
import Countries from './pages/setup/Countries';
import States from './pages/setup/States';
import Cities from './pages/setup/Cities';
import WebsiteStates from './pages/setup/WebsiteStates';
import WebsiteCities from './pages/setup/WebsiteCities';




import UserManagement from './pages/admin/UserManagement';
import ListOfValues from './pages/admin/ListOfValues';
import EntityIdRepository from './pages/admin/EntityIdRepository';
import SMSOutbox from './pages/admin/SMSOutbox';
import PortalIntegration from './pages/admin/PortalIntegration';
import BungalowConfigurations from './pages/admin/BungalowConfigurations';
import ListViewColumn from './pages/admin/ListViewColumn';

import Areas from './pages/setup/areas'; 
import Localities from './pages/setup/localities'; 
// Admin Pages

import Report from './pages/admin/general/Report';


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
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
        {/*Dashboard*/}
        <Route path="/" element={<Dashboard />} />
        
<Route path="admin/usermanagement">
  <Route index element={<UserManagement />} />
  <Route path="reports" element={<Report />} />
</Route>

  
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
            <Route path="website-states" element={<WebsiteStates />} />
            <Route path="website-cities" element={<WebsiteCities />} />
          
            <Route path="document-centre" element={<DocumentCentre />} />
            <Route path="organisation" element={<Organisation />} />
            <Route path="website-panel" element={<WebsitePanel />} />
            <Route path="virtual-number" element={<VirtualNumber />} />
            <Route path="countries" element={<Countries />} />
            <Route path="states" element={<States />} />
            <Route path="cities" element={<Cities />} />
            <Route path="areas" element={<Areas />} />
            <Route path="localities" element={<Localities />} />
          </Route>


          {/* Admin */}
          <Route path="admin/list-of-values" element={<ListOfValues />} />
          <Route path="admin/entity-id-repository" element={<EntityIdRepository />} />
          <Route path="/admin/sms-outbox" element={<SMSOutbox />} />
          <Route path="/admin/portal-integration" element={<PortalIntegration/>} />
          <Route path="/admin/bungalow-configurations" element={<BungalowConfigurations />} />


        </Route>
      </Route>

      {/* Catch-all route */}
      <Route
        path="*"
        element={<Navigate to={localStorage.getItem('user') ? '/' : '/login'} />}
      />

      <Route path="/admin/usermanagement" element={<UserManagement />} />

    </Routes>
  );
};

export default AppRoutes;
