// TestComponent.js
import React, { useRef } from 'react';

export default function TestComponent() {
  const ref = useRef();

  return <div ref={ref}>✅ If you see this, React is working fine!</div>;
}
