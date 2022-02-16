import React from 'react';

import Navbar from './Navbar';

export default function Layout(props) {
  return (
    <div>
      <h1>Site title</h1>
      <Navbar />
      {props.children}
    </div>
  )
}
