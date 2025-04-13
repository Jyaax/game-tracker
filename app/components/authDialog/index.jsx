import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LogIn } from 'lucide-react';
import { LoginForm } from './loginForm';
import { SignUpForm } from './signUpForm';

export const AuthDialog = () => {
  const [open, setOpen] = useState(false);
  const [hasAccount, setHasAccount] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 px-4">
          <LogIn className="mr-2 h-4 w-4" />
          Log in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>
        {hasAccount ? <LoginForm /> : <SignUpForm />}
        <Button variant="link" onClick={() => setHasAccount(!hasAccount)}>
          {hasAccount ? 'Create an account' : 'Already have an account? Log in'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
