import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="p-4">
      <h3>Access denied</h3>
      <p>You do not have permission to view this page.</p>
      <p>
        <Link to="/">Go back home</Link>
      </p>
    </div>
  );
}
