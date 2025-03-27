import { Link } from 'react-router-dom';

function Miami() {
  return (
    <div className="miami-page">
      <h1>Miami Beach</h1>
      <p>Welcome to Miami Beach! Here, you can find amazing waves, beautiful sand, and a lively atmosphere.</p>
      <Link to="/">← Back to Home</Link>
    </div>
  );
}

export default Miami;
