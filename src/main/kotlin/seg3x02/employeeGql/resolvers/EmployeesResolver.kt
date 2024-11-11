package seg3x02.employeeGql.resolvers

import org.springframework.stereotype.Controller
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.Argument
import seg3x02.employeeGql.entity.Employee
import seg3x02.employeeGql.repository.EmployeesRepository
import seg3x02.employeeGql.resolvers.types.CreateEmployeeInput
import java.util.UUID

@Controller
class EmployeesResolver(
    private val employeesRepository: EmployeesRepository
) {

    @QueryMapping
    fun getAllEmployees(): List<Employee> {
        return employeesRepository.findAll()
    }

    @QueryMapping
    fun getEmployeeById(@Argument id: String): Employee? {
        return employeesRepository.findById(id).orElse(null)
    }

    @MutationMapping
    fun createEmployee(@Argument input: CreateEmployeeInput): Employee {
        val employee = Employee(
            id = UUID.randomUUID().toString(),
            name = input.name ?: "",
            dateOfBirth = input.dateOfBirth ?: "",
            city = input.city ?: "",
            salary = input.salary ?: 0.0f,
            gender = input.gender,
            email = input.email
        )
        return employeesRepository.save(employee)
    }
}
