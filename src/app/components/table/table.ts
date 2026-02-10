import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ColumnItem } from '../../models/column-item';
import { toSignal } from '@angular/core/rxjs-interop';

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
  users = toSignal(this.userService.getUsers(), { initialValue: []});

  listOfColumns: ColumnItem[] = [
    {
      name: 'First name',
      sortOrder: null,
      sortFn: (a: User, b: User) => (a.firstName ?? '').localeCompare(b.firstName ?? ''),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Last name',
      sortOrder: null,
      sortFn: (a: User, b: User) => (a.lastName ?? '').localeCompare(b.lastName ?? ''),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Date of birth',
      sortOrder: null,
      sortFn: (a, b) => (a.birthDate ?? '').localeCompare(b.birthDate ?? ''),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
    {
      name: 'Title',
      sortOrder: null,
      sortFn: (a: User, b: User) => (a.title ?? '').localeCompare(b.title ?? ''),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [
        { text: 'Mr', value: 'Mr' },
        { text: 'Mrs', value: 'Mrs'},
        { text: 'Ms', value: 'Ms'}
      ],
      filterFn: (list: string[], user: User) => list.some(title => user.title && user.title === title)
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

    const term = this.normalize(this.searchTerm());

    return this.users().filter(user => {
      if (!term) return true;

      return [
        user.firstName,
        user.lastName,
        `${user.firstName} ${user.lastName}`,
        `${user.lastName} ${user.firstName}`,
        user.phone
      ].map(this.normalize)
      .some(v => v.includes(term));
    });
  })

  private normalize(v: string = ''): string {
    return v.toLowerCase().replace(/\s+/g, ' ').trim();
  }
  
}
