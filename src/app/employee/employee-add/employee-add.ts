import { Component, OnInit } from "@angular/core";
import { EmployeeService } from "../services/employee.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { map, Observable, startWith } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'app-employee-add',
  standalone: true,
  templateUrl: './employee-add.html',
  styleUrl: './employee-add.scss',
  imports: [CommonModule, ReactiveFormsModule,MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule]
})
export class EmployeeAddComponent implements OnInit {
  employeeForm!: FormGroup
  today: Date = new Date()
  statusList: string[] = [
    'Contract',
    'Permanent'
  ]
  groupList: string[] = [
    'IT',
    'Manager',
    'Accounting',
    'HR',
    'Finance',
    'Legal',
    'Director',
    'Design',
    'CEO',
    'General Affair'
  ]
  filteredGroups!: Observable<string[]>;
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    this.employeeForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      basicSalary: ['', Validators.required],
      status: ['', Validators.required],
      group: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  ngOnInit(): void {
   this.filteredGroups = this.employeeForm.controls['group'].valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '')),
    ); 
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.groupList.filter(option => option.toLowerCase().includes(filterValue));
  }

  onCancel() {
    this.router.navigate(['employee', 'list'])
  }

  onSubmit() {
    this.employeeService.add(this.employeeForm.value)
  }
}