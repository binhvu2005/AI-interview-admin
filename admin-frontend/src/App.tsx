import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { AdminRoutes } from './routes';
import './index.css';

function AppContent() {
  const element = useRoutes(AdminRoutes);
  return element;
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
