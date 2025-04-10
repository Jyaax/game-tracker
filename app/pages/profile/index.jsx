export const ProfilePage = () => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-6">Profile</h1>
      <div className="max-w-md mx-auto">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Username</h2>
            <p className="text-muted-foreground">Your username here</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Games Played</h2>
            <p className="text-muted-foreground">0 games</p>
          </div>
        </div>
      </div>
    </>
  );
};
