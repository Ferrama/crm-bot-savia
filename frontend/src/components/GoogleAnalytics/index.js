import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const ga4Tag = '';
const scriptSrc = `https://www.googletagmanager.com/gtag/js?id={ga4Tag}`;

const GoogleAnalytics = () => {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', ga4Tag, {
      page_title: window.location.host,
    });
  }, []);

  return (
    <Helmet>
      <script async src={scriptSrc}></script>
    </Helmet>
  );
};

export default GoogleAnalytics;
