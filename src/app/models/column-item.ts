import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";
import { User } from "./user";

export interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<User> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<User> | null;
  priority: number | false;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}