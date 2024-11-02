import React from 'react';
import { CSidebar, CSidebarNav, CNavItem, CNavLink, CNavTitle } from '@coreui/react';
import CIcon from '@coreui/icons-react'

const SideNav = () => {
  return (
    <CSidebar>
      <CSidebarNav>
        <CNavTitle>Navigation</CNavTitle>
        <CNavItem>
          <CNavLink href="/home">
            <CIcon className="cil-home" /> Home
          </CNavLink>
        </CNavItem>
        {/* Tambahkan link navigasi lainnya */}
      </CSidebarNav>
    </CSidebar>
  );
};

export default SideNav;
