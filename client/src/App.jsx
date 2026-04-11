import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Router from './router';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
