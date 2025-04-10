import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">GameTracker</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
