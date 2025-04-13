import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Library } from "./library";
import { Wishlist } from "./wishlist";
import { useAuth } from "@/contexts/AuthContext";

export const LibraryPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>You need to be logged in to see your library</div>;
  }

  return (
    <Tabs defaultValue="library">
      <TabsList>
        <TabsTrigger value="library">Library</TabsTrigger>
        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
      </TabsList>
      <TabsContent value="library">
        <Library />
      </TabsContent>
      <TabsContent value="wishlist">
        <Wishlist />
      </TabsContent>
    </Tabs>
  );
};
