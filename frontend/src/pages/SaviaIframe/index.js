import React from 'react';

function SaveIframe() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src='https://www.savia3.com.ar/'
        title='Savia Website'
        width='100%'
        height='100%'
        frameBorder='0'
        allowFullScreen
      />
    </div>
  );
}

export default SaveIframe;
