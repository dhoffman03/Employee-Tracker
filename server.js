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
            message: 'Please enter the department you would like to add.',
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
        // INSERT new department to table
        .then((answer) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
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
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'Please enter the role you would like to add.',
            validate: role => {
                if (role) {
                    return true;
                } else {
                    console.log('Please enter a role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this role?',
        }
    ])
        .then((answer) => {
            const params = [answer.role, answer.salary];
            // Get dept from department table
            const roleSql = `SELECT name, id FROM department`;

            db.query(roleSql, (err, data) => {
                if (err) throw err;
                const dept = data.map(({ name, id }) => ({ name: name, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'dept',
                        message: 'What department does this role belong to?',
                        choices: dept
                    }
                ])
                    .then(deptChoice => {
                        const dept = deptChoice.dept;
                        params.push(dept);

                        // INSERT new role to table
                        const sql = `INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)`;

                        db.query(sql, params, (err, res) => {
                            if (err) throw err;
                            console.log('Successfully added' + answer.role + ' to roles')

                            viewRoles();
                            runPrompts();
                        })
                    })
            })
        })
};

// function to add an employee
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Please enter the employee's first name",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Please enter the employee's last name",
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        },
    ])
        .then((answer) => {
            const params = [answer.firstName, answer.lastName];

            // Grab roles
            const roleSql = `SELECT role.id, role.title FROM role`;

            db.query(roleSql, (err, data) => {
                if (err) throw err;
                const roles = data.map(({ title, id }) => ({ name: title, value: id }));

                // Get employee's role
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        params.push(role);

                        const managerSql = `SELECT * FROM employee`;

                        db.query(managerSql, (err, data) => {
                            if (err) throw err;
                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                            // Get employee's manager
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managers
                                }
                            ])
                                .then(maagerChoice => {
                                    const manager = maagerChoice.manager;
                                    params.push(manager)

                                    // Add new employee to table
                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`;

                                    db.query(sql, params, (err, res) => {
                                        if (err) throw err;
                                        console.log('New employee successfully added!')

                                        viewEmployees();
                                        runPrompts();
                                    })
                                })
                        })
                    })
            })
        })
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
