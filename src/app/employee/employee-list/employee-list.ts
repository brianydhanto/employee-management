import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IEmployee } from "../models/employee.model";
import { EmployeeService } from "../services/employee.service";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { LoginService } from "../../login/services/login.service";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class EmployeeListComponent implements OnInit {
  employees$ = new BehaviorSubject<IEmployee[]>([])
  currentPage: number = 1
  itemsPerPage: number = 10
  readonly pageSizes: number[] = [10, 20, 50, 100]
  search: string = ''
  sort = {
    header: 'name',
    sortBy: ''
  }
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly loginService: LoginService,
    private readonly router: Router
  ) {

  }

  ngOnInit(): void {
    this.getList()
    this.onGetSearch()
    this.onSort('name')
  }

  onChangePage(page: number): void {
    this.currentPage = page
  }

  onSearch(): void {
    this.onSetSearch(this.search)
    if (this.search) {
      const split = this.search?.split(" ")
      const firstSplit = split[0].toLowerCase()
      const lastSplit = split[split.length - 1].toLowerCase()
      const employees = this.employeeService.list().filter((x: any) => {
        const name = (x.firstName + ' ' + x.lastName).toLowerCase()
        const email = (x.email).toLowerCase()
        if (split.length > 1) {
          if (lastSplit.includes('@')) {
            return name.includes(firstSplit) && email.includes(lastSplit)
          }
          return name.toLowerCase().includes(firstSplit) && email.includes(lastSplit)
        } else if (split.length == 1) {
          if (firstSplit.includes('@')) {
            return email.includes(firstSplit)
          }
          return name.includes(firstSplit)
        } 
      })
      if (employees) {
        this.employees$.next(employees)
      } else {
        this.getList()
      }
    } else {
      this.getList()
    }
  }

  onAdd(): void {
    this.router.navigate(['employee', 'add'])
  }

  onDetail(employee: IEmployee): void {
    this.employeeService.set(employee)
  }

  onEdit(employee: IEmployee): void {
    this.employeeService.edit(employee)
  }

  onDelete(employee: IEmployee): void {
    this.employeeService.delete(employee)
    this.employees$.next(this.employeeService.list())
    this.onResetPagination()
  }

  onSort(sortBy: string): void {
    this.sort.header = sortBy
    this.sort.sortBy = this.sort.sortBy === 'desc' || !this.sort.sortBy ? 'asc' : 'desc'

    this.employees$.value.sort((x: any, y:any) => {
      if (this.sort.header === 'name') {
        const name = x['firstName'] + x['lastName']
        const compare = y['firstName'] + y['lastName']
        return this.sort.sortBy === 'asc' ? name.localeCompare(compare) : compare.localeCompare(name) 
      }
      return this.sort.sortBy === 'asc' ? x[sortBy].localeCompare(y[sortBy]) : y[sortBy].localeCompare(x[sortBy]) 
    })
  }

  getList(): void {
    this.employees$.next(this.employeeService.list())
  }

  onSetSearch(searchKey: string) {
    localStorage.setItem('searchKey', searchKey)
  }

  onGetSearch() {
    const searchKey = localStorage.getItem('searchKey')
    if (searchKey) {
      this.search = searchKey
      this.onSearch()
    }
  }

  onResetPagination() {
    this.currentPage = 1
  }

  logout(): void {
    this.loginService.logout()
  }

  get totalPages() {
    return Math.ceil(this.employees$.value.length / this.itemsPerPage);
  }
}