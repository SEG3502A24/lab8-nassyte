import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Employee } from '../model/employee';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';

const GET_EMPLOYEES = gql`
  query {
    getAllEmployees {
      id
      name
      dateOfBirth
      city
      salary
      gender
      email
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation createEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
      name
      dateOfBirth
      city
      salary
      gender
      email
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  employees$: BehaviorSubject<readonly Employee[]> = new BehaviorSubject<readonly Employee[]>([]);

  constructor(private apollo: Apollo) {
    this.apollo.watchQuery<any>({ query: GET_EMPLOYEES }).valueChanges.pipe(
      map(({ data, loading }) => {
        this.employees$.next(data.getAllEmployees); //
      })
    ).subscribe();
  }

  get $(): Observable<readonly Employee[]> {
    return this.employees$.asObservable();
  }

  addEmployee(employee: Employee) {
    return this.apollo.mutate<any>({
      mutation: ADD_EMPLOYEE,
      variables: {
        input: {  //
          name: employee.name,
          dateOfBirth: employee.dateOfBirth,
          city: employee.city,
          salary: employee.salary,
          gender: employee.gender,
          email: employee.email
        }
      }
    }).pipe(
      map(({ data, loading }) => {
        this.employees$.next([...this.employees$.getValue(), data.createEmployee]);
      })
    );
  }
}
