import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { IEmployee } from "../models/employee.model";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { employeeMsg } from "../constant/employee.constant";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  employees = new BehaviorSubject<IEmployee[]>([])
  employee = new BehaviorSubject<IEmployee | null>(null)

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {

  }

  all(): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>('users.json')
    .pipe(
      tap((data) => this.employees.next(data)),
      tap((data) => this.storage(data)),
    )
  }

  list(): IEmployee[] {
    if (this.take().length > 0) {
      this.employees.next(this.take())
    }
    return this.employees.value
  }

  detail(): IEmployee | null {
    return this.employee.value || null
  }

  add(request: IEmployee): void {
    let employees = this.employees.value
    const user = employees.filter((employee) => (employee.username === request.username) || (employee.email === request.email))
    if (user.length > 0) {
      this.toastr.warning(employeeMsg.exist.message, employeeMsg.exist.status)
      return;
    }
    this.employees.next([request, ...employees])
    this.storage(this.employees.value)
    this.toastr.success(employeeMsg.add.message, employeeMsg.add.status)
    localStorage.removeItem('searchKey')
    this.router.navigate(['employee', 'list'])
  }

  edit(request: IEmployee): void {
    const employees = this.employees.value
    employees.map((employee) => {
      if (employee.username === request.username) {
        employee.status = employee.status === 'Contract' ? 'Permanent' : 'Contract'
        return employee
      }
      return employee
    })
    this.employees.next(employees)
    this.storage(this.employees.value)
    this.toastr.warning(employeeMsg.edit.message, employeeMsg.edit.status)
  }

  set(request: IEmployee): void {
    this.employee.next(request)
    this.router.navigate(['employee', 'detail'])
  }

  delete(request: IEmployee): void {
    const employees = this.employees.value
    const filter = employees.filter((employee) => employee.username != request.username)
    this.employees.next(filter)
    this.storage(this.employees.value)
    this.toastr.error(employeeMsg.delete.message, employeeMsg.delete.status)
  }

  storage(data: IEmployee[]): void {
    localStorage.setItem('employees', JSON.stringify(data))
  }

  take(): IEmployee[] {
    const data = localStorage.getItem('employees')
    if (data) {
      return JSON.parse(data)
    }
    return []
  }

  reset(): void {
    this.employee.next(null)
  }
}