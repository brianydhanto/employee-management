import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CardComponent } from "../../shared/components/card/card";

@Component({
  selector: 'app-employee',
  standalone: true,
  templateUrl: './employee.html',
  styleUrl: './employee.scss',
  imports: [RouterOutlet, CardComponent],
})
export class EmployeeComponent {
  
}