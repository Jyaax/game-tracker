import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";

export function DataTable({ columns, data, sorting, setSorting, onRefresh }) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      onRefresh,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.column.columnDef.size }}
                  className={cn(
                    "whitespace-nowrap px-4",
                    header.id === "background_image" && "w-[8%]",
                    header.id === "name" && "w-[42%]",
                    header.id === "rating" && "w-[12%] text-center",
                    header.id === "times_played" && "w-[12%] text-center",
                    header.id === "platine" && "w-[8%] text-center",
                    header.id === "actions" && "w-[18%] text-center"
                  )}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "whitespace-nowrap px-4",
                      cell.column.id === "background_image" && "w-[8%]",
                      cell.column.id === "name" && "w-[42%] text-left",
                      cell.column.id === "rating" && "w-[12%] text-center",
                      cell.column.id === "times_played" &&
                        "w-[12%] text-center",
                      cell.column.id === "platine" && "w-[8%] text-center",
                      cell.column.id === "actions" && "w-[18%] text-center"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center",
                        cell.column.id === "name"
                          ? "justify-start"
                          : "justify-center"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
