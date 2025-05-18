import React from "react";

const Footer = () => {
  return (
    <footer className="main-footer bg-light text-muted py-3 border-top mt-auto">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="mb-2 mb-md-0">
          <strong>
            &copy; 2025{" "}
            <a
              href="https://rangguy.github.io/rangga/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              Rangga Dwi Mahendra
            </a>
          </strong>{" "}
          &mdash; All rights reserved.
        </div>
        <div>
          <span className="text-muted">
            <strong>Version</strong> 1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
