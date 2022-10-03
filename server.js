// Import dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');


//connect to db
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'october2003',
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
                    'Add Employee',
                    'Update Employee Role',
                    "Update Employee's Manager",
                    'Delete Department',
                    'Delete Role',
                    'Delete Employee',
                    'EXIT'
                ],
            }
        ])
        .then((answers) => {
            const { choices } = answers;

            switch (choices) {
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployee();
                    break;
                case "Update Employee's Manager":
                    updateManager();
                    break;
                case 'Delete Department':
                    deletDepartment();
                    break;
                case 'Delete Role':
                    deletRole();
                    break;
                case 'Delete Employee':
                    deletEmployee();
                    break;
                case 'EXIT':
                    db.end();
                    break;
                default:
                    console.log(`Empty action recieved`);
            }
        })
        .catch((err) => {
            if (err) throw err;
        });
};

// Function to view all departments
viewDepartments = () => {
    // SELECT everything form department table
    const sql = `SELECT * FROM department`;
    // SQL query
    db.query(sql, (err, res) => {
        if (err) throw err;
        // Show table in terminal
        console.table('\nAll Departments:\n', res);
        runPrompts();
    });
};

// Function to view all roles
viewRoles = () => {
    var query = `SELECT role.id, role.title, role.salary, department.name AS department 
                        FROM role 
                        INNER JOIN department ON role.department_id = department.id`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table('\nAll Roles:\n', res);
        runPrompts();
    });
};

// Function to view all employees 
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
    });
};

// Function to add a department
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
        // INSERT new department to table
        .then((answer) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            db.query(sql, answer.addDept, (err, res) => {
                if (err) throw err;
                console.log('\nSuccessfully added ' + answer.addDept + ' to departments\n')

                // viewDepartments();
                runPrompts();
            });
        });
};

// Function to add a role
addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'Enter the role you would like to add.',
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
                    .then(deptAnswer => {
                        const dept = deptAnswer.dept;
                        params.push(dept);

                        // INSERT new role to table
                        const sql = `INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)`;

                        db.query(sql, params, (err, res) => {
                            if (err) throw err;
                            console.log('\nSuccessfully added ' + answer.role + ' to roles\n')

                            // viewRoles();
                            runPrompts();
                        });
                    });
            });
        });
};

// Function to add an employee
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Enter the employee's first name",
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
            message: "Enter the employee's last name",
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
                    .then(roleAnswer => {
                        const role = roleAnswer.role;
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
                                    choices: managers,
                                }
                            ])
                                .then(managerAnswer => {
                                    const manager = managerAnswer.manager;
                                    params.push(manager)

                                    // Add new employee to table
                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`;

                                    db.query(sql, params, (err, res) => {
                                        if (err) throw err;
                                        console.log('\nNew employee successfully added!\n')

                                        // viewEmployees();
                                        runPrompts();
                                    });
                                });
                        });
                    });
            });
        });
};

// Function to update an employee role
updateEmployee = () => {
    // Grab table
    const employeeSql = `SELECT * FROM employee`;

    db.query(employeeSql, (err, data) => {
        if (err) throw err;
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: employees
            }
        ])
            .then((empChoice) => {
                const employee = empChoice.employee;
                const params = [];
                params.push(employee);

                // Grab role table
                const roleSql = `SELECT * FROM role`;

                db.query(roleSql, (err, data) => {
                    if (err) throw err;
                    const roles = data.map(({ title, id }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's new role?",
                            choices: roles
                        }
                    ])
                        .then(roleAnswer => {
                            const role = roleAnswer.role;
                            params.push(role);

                            let employee = params[0]
                            params[0] = role
                            params[1] = employee

                            // Updating employee's role
                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                            db.query(sql, params, (err, res) => {
                                if (err) throw err;
                                console.log('\nEmployee has been updated!\n')
                                // viewEmployees();
                                runPrompts();
                            });
                        });
                });
            });
    });
};

////////////////
///  BONUS  ///
///////////////
// Function to UPDATE employee's manager
updateManager = () => {
    const employeeSql = `SELECT * FROM employee`;

    db.query(employeeSql, (err, data) => {
        if (err) throw err;
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: employees
            }
        ])
            .then((empChoice) => {
                const employee = empChoice.employee;
                const params = [];
                params.push(employee);

                const managerSql = `SELECT * FROM employee`;

                db.query(managerSql, (err, data) => {
                    if (err) throw err;
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is employee's new manager?",
                            choices: managers
                        }
                    ])
                        .then(managerAnswer => {
                            const manager = managerAnswer.manager;
                            params.push(manager);

                            let employee = params[0]
                            params[0] = manager
                            params[1] = employee

                            const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                            db.query(sql, params, (err, res) => {
                                if (err) throw err;
                                console.log('\nEmployee has been updated!\n')
                                // viewEmployees();
                                runPrompts();
                            });
                        });
                });
            });
    });
};

// Function to DELETE department
deletDepartment = () => {
    // Grab table
    const deptSql = `SELECT * FROM department`

    db.query(deptSql, (err, data) => {
        if (err) throw err;
        const dept = data.map(({ id, name }) => ({ name: name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'dept',
                message: 'Select the department you would like to delete.',
                choices: dept,
            }
        ])
            .then(deptAnswer => {
                const dept = deptAnswer.dept;
                // Delete department from table
                const sql = `DELETE FROM department WHERE id = ?`;

                db.query(sql, dept, (err, res) => {
                    if (err) throw err;
                    console.log('\nDepartment successfully deleted!\n')
                    // viewDepartments();
                    runPrompts();
                });
            });
    });
};

// Function to DELETE role
deletRole = () => {
    const roleSql = `SELECT * FROM role`

    db.query(roleSql, (err, data) => {
        if (err) throw err;
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Select the role you would like to delete.',
                choices: roles
            }
        ])
            .then(roleAnswer => {
                const role = roleAnswer.role;
                const sql = `DELETE FROM role WHERE id = ?`;

                db.query(sql, role, (err, res) => {
                    if (err) throw err;
                    console.log('\nRole successfully deleted!\n')
                    // viewRoles();
                    runPrompts();
                });
            });
    });
};

// Function to DELETE employee
deletEmployee = () => {
    const emplSql = `SELECT * FROM employee`

    db.query(emplSql, (err, data) => {
        if (err) throw err;
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select the employee you would like to delete.',
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.employee;
                const sql = `DELETE FROM employee WHERE id = ?`;

                db.query(sql, employee, (err, res) => {
                    if (err) throw err;
                    console.log('\nEmployee successfully deleted!\n')
                    // viewEmployees();
                    runPrompts();
                });
            });
    });
};