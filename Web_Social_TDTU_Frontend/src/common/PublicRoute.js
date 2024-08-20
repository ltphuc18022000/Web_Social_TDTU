import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../common/functions';

// route not logged in yet
const PublicRoute = () => {
  const auth = getToken(); // determine if authorized, from context or however you're doing it
  // If authorized, return an outlet that will render child elements
  // nêu có authen, trả ra các phâ tư con
  // neu ko tra ve login page
  return !auth ? <Outlet /> : <Navigate to="/" />;
}
export default PublicRoute;