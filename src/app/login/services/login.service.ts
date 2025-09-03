import { Injectable } from "@angular/core";
import { EmployeeService } from "../../employee/services/employee.service";
import { ILoginRequest } from "../models/login.model";
import { ToastrService } from "ngx-toastr";
import { loginMessage, loginPassword } from "../constant/login.constant";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {

  }
  login(request: ILoginRequest) {
    const employees = this.employeeService.list()
    if (employees.length > 0) {
      const user = employees.filter((employee) => employee.username === request.username)
      if (user && request.password === loginPassword) {
        this.toastr.success(loginMessage.loginSucess.message, loginMessage.loginSucess.status)
        this.storage()
        return true;
      } 
      this.toastr.warning(loginMessage.loginFailed.message, loginMessage.loginFailed.status)
    }
    return false
  }

  logout(): void {
    localStorage.clear()
    this.router.navigate(['login'])
  }

  storage(): void {
    localStorage.setItem('login', 'Y')
  }

  status(): boolean {
    const status = localStorage.getItem('login')
    return status === 'Y'
  }

  redirect(): void {
    if (this.status()) {
      this.router.navigate(['employee', 'list'])
    }
  }
}