import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ColumnItem } from '../../models/column-item';
import { isBefore} from 'date-fns'

@Component({
  selector: 'app-table',
  imports: [
    FormsModule,
    NzTableModule
  ],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  userService = inject(UserService)
  users = signal<User[]>([])
  listOfColumns: ColumnItem[] = [
    {
      name: 'First name',
      sortOrder: null,
      sortFn: (a: User, b: User) => a.firstName.localeCompare(b.lastName),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: User) => list.some(name => item.firstName.indexOf(name) !== -1)
    },
    {
      name: 'Last name',
      sortOrder: null,
      sortFn: (a: User, b: User) => a.lastName.localeCompare(b.lastName),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: User) => list.some(name => item.lastName.indexOf(name) !== -1)
    }
  ]

  searchTerm = signal('')
  filteredUsers = computed(()=>{
    const term = this.searchTerm().toLowerCase();
    return this.users().filter(user =>
      term === '' || user.firstName.toLowerCase().includes(term))
  })  

  ngOnInit(){
    this.userService.getUsers().subscribe({
      next:(data) => this.users.set(data)
    })
  }
}
