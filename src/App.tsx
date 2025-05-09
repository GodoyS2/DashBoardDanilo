import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PeopleManager from './pages/PeopleManager';
import GroupManager from './pages/GroupManager';
import LocationManager from './pages/LocationManager';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="people" element={<PeopleManager />} />
              <Route path="groups" element={<GroupManager />} />
              <Route path="locations" element={<LocationManager />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;