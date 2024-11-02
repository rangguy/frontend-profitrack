import React from 'react';
import { CNavbar, CNavbarBrand, CNavbarNav, CNavItem, CNavLink } from '@coreui/react';

const Navbar = () => {
  return (
    <CNavbar colorScheme="light">
      <CNavbarBrand href="/">MyApp</CNavbarBrand>
      <CNavbarNav>
        <CNavItem>
          <CNavLink href="/profile">Profile</CNavLink>
        </CNavItem>
      </CNavbarNav>
    </CNavbar>
  );
};

export default Navbar;
