import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center">
            <Link to="/" className="mr-6 flex items-center">
              <span className="font-bold">GameTracker</span>
            </Link>
            <NavigationMenu className="relative">
              <NavigationMenuList className="relative">
                <NavigationMenuItem>
                  <Link to="/browse" className="block">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Browse
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/profile" className="block">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Profile
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
