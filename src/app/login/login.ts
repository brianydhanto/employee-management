import { Component, OnInit } from "@angular/core";
import { CardComponent } from "../../shared/components/card/card";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { EmployeeService } from "../employee/services/employee.service";
import { Subscription } from "rxjs";
import { LoginService } from "./services/login.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [CommonModule, ReactiveFormsModule, CardComponent]
})
export class LoginComponent implements OnInit {
  subscription$!: Subscription
  loginForm!: FormGroup

  constructor(
    private readonly fb: FormBuilder,
    private readonly employeeService: EmployeeService,
    private readonly loginService: LoginService,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getEmployees()
  }

  getEmployees(): void {
    this.subscription$ = this.employeeService
    .all()
    .subscribe()
  }

  login(): void {
    const isSuccess = this.loginService.login(this.loginForm.value)
    if (isSuccess) {
      this.router.navigate(['/employee'])
    }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe()
  }
}