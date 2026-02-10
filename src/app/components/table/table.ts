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
      sortFn: (a: User, b: User) => a.firstName.localeCompare(b.firstName),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Last name',
      sortOrder: null,
      sortFn: (a: User, b: User) => a.lastName.localeCompare(b.lastName),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Date of birth',
      sortOrder: null,
      sortFn: (a: User, b: User) => this.datesCompare(a.birthDate, b.birthDate),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
    {
      name: 'Title',
      sortOrder: null,
      sortFn: (a: User, b: User) => a.title.localeCompare(b.title),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [
        { text: 'Mr', value: 'Mr' },
        { text: 'Mrs', value: 'Mrs'},
        { text: 'Ms', value: 'Ms'}
      ],
      filterFn: (list: string[], item: User) => list.some(name => item.title === name)
    },
    {
      name: 'Phone number',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: null
    },
  ]

  searchTerm = signal('')
  filteredUsers = computed(()=>{
    const normalize = (v: string) =>
    v.toLowerCase().replace(/\s+/g, ' ').trim();

    const term = normalize(this.searchTerm());

    return this.users().filter(user => {
      if (!term) return true;

      const first = normalize(user.firstName);
      const last = normalize(user.lastName);

      return [
        first,
        last,
        `${first} ${last}`,
        `${last} ${first}`
      ].some(v => v.includes(term));
    });
  })

  datesCompare(d1: Date, d2: Date){
    let date1 = new Date(d1)
    let date2 = new Date(d2)
    switch(isBefore(date1, date2)){
      case true: return 1;
      case false: return -1;
    }
  }

  ngOnInit(){
    this.userService.getUsers().subscribe({
      next:(data) => this.users.set(data)
    })
  }
}
