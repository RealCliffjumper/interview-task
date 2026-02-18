import { Component, computed, effect, inject, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ColumnItem } from '../../models/column-item';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { UserCount } from '../../models/user-count';
import { DECADES_DIC } from '../../models/decades-dic';
import saveAs from 'file-saver';

@Component({
  selector: 'app-table',
  imports: [
    FormsModule,
    NzTableModule
],
  templateUrl: './table.html',
  styleUrl: './table.css',
})

//take filtered users take dob find out decade born in display count per decade
//export filtered to json file via button
//metric how many users fall last name starting between A->M the rest M->Z
export class Table {

  userService = inject(UserService)
  users = toSignal(this.userService.getUsers().pipe(
    catchError(()=>{
        throw 'error loading the data'
      })
    ), 
    { initialValue: []}
  );

  decades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] //decades for matching
  dec_dic = DECADES_DIC

  userCount = signal<UserCount[]>([])
  count1 = signal<number>(0)
  count2 = signal<number>(0)

  listOfColumns: ColumnItem[] = [
    {
      name: 'First name',
      sortOrder: null,
      sortFn: (a: User, b: User) => (a.firstName ?? '').localeCompare(b.firstName ?? ''),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      priority:false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Last name',
      sortOrder: null,
      sortFn: (a: User, b: User) => (a.lastName ?? '').localeCompare(b.lastName ?? ''),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      priority:false,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Date of birth',
      sortOrder: null,
      sortFn: (a, b) => (a.birthDate ?? '').localeCompare(b.birthDate ?? ''),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: false,
      priority:2,
      listOfFilter: [],
      filterFn: null,
    },
    {
      name: 'Title',
      sortOrder: null,
      sortFn: (a: User, b: User) => (a.title ?? '').localeCompare(b.title ?? ''),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      priority:1,
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
      priority:false,
      listOfFilter: [],
      filterFn: null
    },
  ]


  searchTerm = signal('')
  filteredUsers = computed(()=>{
    const term = this.normalize(this.searchTerm());
    
    return this.users().filter(user => {
      
      const matchesNameorPhone = !term || [
        user.firstName,
        user.lastName,
        `${user.firstName} ${user.lastName}`,
        `${user.lastName} ${user.firstName}`,
        user.phone
      ].map(this.normalize)
      .some(v => v.includes(term));

      return matchesNameorPhone;
    });
  })
 
  //this is where the counting resides
  constructor(){
    effect(()=>{
      this.userCount.set([])
      this.count1.set(0)
      for(let i=0; i<this.decades.length; i++){

        const usersForEachDecade = this.filteredUsers().filter(user => {
            return this.getDecade(user.birthDate) === this.decades[i]
          })
       
        const newUserCount = {decade: this.decades[i], count: usersForEachDecade.length}
        this.userCount.update(values => [...values, newUserCount])
      }
      const length = this.filteredUsers().length
      for(let i=0; i<length; i++){
        console.log(this.normalize2(this.filteredUsers()[i].lastName))
        if(this.normalize2(this.filteredUsers()[i].lastName)){
          this.count1.update(value=> value + 1)
        }
        else{
          this.count2.update(value=> value + 1)
        }
      }
  })
  }

  getDecade(dob: string){
    const n1 = new Date(dob).getFullYear()%1000
    const n2 = Math.floor(n1%100/10)
    return n2;
  }

  export(){
    const users = this.filteredUsers()
    let file = new Blob([JSON.stringify(users)], {type: 'json'})
    saveAs(file, 'test.json')
  }

  private normalize(v: string = ''): string {
    return v.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  normalize2(v: string = ''){
    console.log(v.toLowerCase().match(/[a-m]/g)?.at(0)?.length)

    return v.toLowerCase().match(/^[A-Ma-m]/)
  }
  
}

