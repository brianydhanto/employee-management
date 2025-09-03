import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IEmployee } from "../models/employee.model";
import { EmployeeService } from "../services/employee.service";
import { CommonModule } from "@angular/common";
import { RupiahPipe } from "../../../shared/pipe/rupiah.pipe";

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  templateUrl: './employee-detail.html',
  styleUrl: './employee-detail.scss',
  imports: [CommonModule, RupiahPipe]
})
export class EmployeeDetailComponent implements OnInit {
  employee: IEmployee | null = null
  constructor(
    private readonly router: Router,
    private readonly employeeService: EmployeeService
  ) {

  }

  ngOnInit(): void {
    this.employee = this.employeeService.detail()
  }
  onBack() {
    this.employeeService.reset()
    this.router.navigate(['employee', 'list'])
  }
}