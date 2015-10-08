import React from 'react';
import Container from './Container';

// React dev tools
if (typeof window !== 'undefined') {
  window.react = React;
}



React.render(
  <Container
      width={900}
      height={400}
    >

  </Container>
  , document.getElementById('app')
);
