const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');


//connect to db
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
)

db.connect(err => {
    if (err) throw err;
    affterConnection();
})

affterConnection = () => {
    console.log('****************************');
    console.log('*                          *');
    console.log('*     EMPLOYEE MANAGER     *');
    console.log('*                          *');
    console.log('****************************');

    startApp();
};

const startApp = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choices',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add Department',
                    'Add Role',
                    'Add Employees',
                    'Update Employee Role',
                ],
            }
        ])
        .then((answers) => {
            const { choices } = answers;

            if (choices === 'View All Departments') {
                viewDepartments();
            }

            if (choices === 'View All Roles') {
                viewRoles();
            }

            if (choices === 'View All Employees') {
                viewEmployees();
            }

            if (choices === 'Add Department') {
                addDepartment();
            }

            if (choices === 'Add Role') {
                addRole();
            }

            if (choices === 'Add Employees') {
                addEmployee();
            }

            if (choices === 'Update Employee Role') {
                updateEmployee();
            }
        })
        .catch((err) => {
            if (err) throw err;
        });
}

//function to view all departments
viewDepartments = () => { }

//function to view all roles
viewRoles = () => { }

//function to view all employees 
viewEmployees = () => { }

//function to add a department
addDepartment = () => { }

//function to add a role
addRole = () => { }

//function to add an employee
addEmployee = () => { }

//function to update an employee role
updateEmployee = () => { }







///  BONUS  ///
//function to update employee managers
//function to view employees by manager.
//function to view employees by department
//function to delete departments, roles, and employees
//function to view the total utilized budget of a department