import { Route } from 'react-router-dom';
import RegistrationForm from '../features/registration/RegistrationForm';
import RegistrationCompletePage from '../features/registration/RegistrationCompletePage';

export const registrationRoutes = [
  <Route key="register" path="/register" element={<RegistrationForm />} />,
  <Route key="registration-complete" path="/registration/complete" element={<RegistrationCompletePage />} />
];
