// Import dependencies
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
    console.log(`\nConnected to the employee_db database.\n`)
)

// Catch errors, then run afterConnection()
db.connect(err => {
    if (err) throw err;
    afterConnection();
})

// Once connected to db run prompts
afterConnection = () => {
    console.log('\n****************************');
    console.log('*                          *');
    console.log('*     EMPLOYEE MANAGER     *');
    console.log('*                          *');
    console.log('****************************\n');

    runPrompts();
};

// User prompts
const runPrompts = () => {
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
                    'EXIT'
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

            // End connection to db, and stop prompts if user clicks 'EXIT'
            if (choices === 'EXIT') {
                db.end()
            }
        })
        .catch((err) => {
            if (err) throw err;
        });
};

// function to view all departments
viewDepartments = () => {
    // SELECT everything form department table
    const sql = `SELECT * FROM department`;
    // SQL query
    db.query(sql, (err, res) => {
        if (err) throw err;
        // Show table in terminal
        console.table('\nAll Departments:\n', res);
        runPrompts();
    })
};


// function to view all roles
viewRoles = () => {
    var query = `SELECT role.id, role.title, role.salary, department.name AS department 
                        FROM role 
                        INNER JOIN department ON role.department_id = department.id`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table('\nAll Roles:\n', res);
        runPrompts();
    })
};

// function to view all employees 
viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title,
                        department.name AS department, 
                        role.salary,
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                        FROM employee
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table('\nAll Employees:\n', res);
        runPrompts();
    })
};

// function to add a department
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: 'Enter the department you would like to add.',
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please enter a department');
                    return false;
                }
            }
        }

    ])
        .then((answer) => {
            const sql = `INSERT INTO department (name)
                        VALUES (?)`;
            db.query(sql, answer.addDept, (err, res) => {
                if (err) throw err;
                console.log('Successfully added' + answer.addDept + ' to departments')

                viewDepartments();
                runPrompts();
            })
        })
};

// function to add a role
addRole = () => {

    console.log('Successfully added' + + ' to roles')
    runPrompts();
};

// function to add an employee
addEmployee = () => {

    console.log('New employee successfully added!')
    runPrompts();
};

// function to update an employee role
updateEmployee = () => {

    console.log('Employee has been updated!')
    runPrompts();
};







///  BONUS  ///
//function to update employee managers
//function to view employees by manager.
//function to view employees by department
//function to delete departments, roles, and employees
//function to view the total utilized budget of a department
