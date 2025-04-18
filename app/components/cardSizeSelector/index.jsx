import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, LayoutList, LayoutTemplate } from "lucide-react";

export const CardSizeSelector = ({ onSizeChange }) => {
  return (
    <Tabs defaultValue="medium" onValueChange={onSizeChange}>
      <TabsList>
        <TabsTrigger value="small">
          <LayoutGrid className="h-4 w-4 mr-2" />
          Small
        </TabsTrigger>
        <TabsTrigger value="medium">
          <LayoutTemplate className="h-4 w-4 mr-2" />
          Medium
        </TabsTrigger>
        <TabsTrigger value="large">
          <LayoutList className="h-4 w-4 mr-2" />
          Large
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
