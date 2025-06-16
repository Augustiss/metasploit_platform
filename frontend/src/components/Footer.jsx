import React from 'react';

function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '1rem',
      background: '#1e1e1e',
      color: '#888'
    }}>
      © {new Date().getFullYear()} Interactive Learning Platform • All rights reserved
    </footer>
  );
}

export default Footer;
