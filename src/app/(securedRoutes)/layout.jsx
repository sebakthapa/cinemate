import React from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const layout = ({ children }) => {
  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh' }}>{children}</div>
      <Footer />
    </>
  );
};

export default layout;
