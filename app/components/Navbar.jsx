import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            GameTracker
          </Link>
          <div className="flex gap-4">
            <Link to="/games" className="hover:text-primary">
              Games
            </Link>
            <Link to="/profile" className="hover:text-primary">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
