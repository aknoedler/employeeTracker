const inquirer = require('inquirer');
const db = require('./config/connection');
const cTable = require('console.table');

const menuOptions = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role',
    'Add an employee',
    'Update an employee role',
    'Exit'
];

function displayDepartments() {
    db.promise().query('SELECT * FROM departments')
        .then(results => {
            console.table(results[0]);
            mainMenuPrompt();
        })
};

function displayRoles() {
    db.promise().query(`SELECT roles.id, roles.title, roles.salary, departments.department
                        FROM roles 
                        JOIN departments ON roles.department_id = departments.id`)
        .then(results => {
            console.table(results[0]);
            mainMenuPrompt();
        })
};

function displayEmployees() {
    db.promise().query(`SELECT e.id, e.first_name, e.last_name, roles.title,
                        roles.salary, departments.department, 
                        CONCAT(m.first_name, ' ', m.last_name) AS manager
                        FROM employees e
                        JOIN roles ON e.role_id = roles.id
                        JOIN departments ON roles.department_id = departments.id
                        LEFT JOIN employees m ON m.id = e.manager_id`)
        .then(results => {
            console.table(results[0]);
            mainMenuPrompt();
        })
};

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        message: 'Enter the new deparment name:',
        name: 'newDepartment'
    })
        .then(results => {
            db.promise().query(`INSERT INTO departments (department) VALUES ("${results.newDepartment}")`)
                .then(results => {
                    console.log('New department created.')
                    mainMenuPrompt();
                })
        })
}

function addRole() {
    db.promise().query(`SELECT * FROM departments`)
        .then(results => {
            let returnedDeps = results[0];
            let departmentList = returnedDeps.map(el => el.department);
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'Enter the new role title:',
                    name: 'newTitle'
                },
                {
                    type: 'input',
                    message: "Enter the new role's salary:",
                    name: 'newSalary'
                },
                {
                    type: 'list',
                    message: "Enter the new role's department:",
                    name: 'newDepartment',
                    choices: departmentList,
                    loop: false
                }
            ]
            ).then(results => {
                db.promise().query(`INSERT INTO roles (title, salary, department_id) 
                                    VALUES ("${results.newTitle}",
                                            "${results.newSalary}",
                                            "${returnedDeps[departmentList.indexOf(results.newDepartment)].id}")`)
                    .then(results => {
                        console.log('New role created.')
                        mainMenuPrompt();
                    })
            })
        })

}

function addEmployee() {
    db.promise().query('SELECT * FROM roles')
        .then(results => {
            let returnedRoles = results[0];
            let roleList = returnedRoles.map(el => el.title);
            db.promise().query(`SELECT * FROM employees`)
                .then(results => {
                    let returnedEmployees = results[0];
                    let employeeList = returnedEmployees.map(el => `${el.first_name} ${el.last_name}`);
                    inquirer.prompt([
                        {
                            type: "input",
                            message: "What is the new employee's first name?",
                            name: "newFirstName"
                        },
                        {
                            type: "input",
                            message: "What is the new employee's last name?",
                            name: "newLastName"
                        },
                        {
                            type: "list",
                            message: "What is the new employee's role?",
                            name: "newRole",
                            choices: roleList,
                            loop: false
                        },
                        {
                            type: "list",
                            message: "Who is the new employee's manager?",
                            name: "newManager",
                            choices: employeeList,
                            loop: false
                        }
                    ]).then(results => {
                        db.promise().query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                                    VALUES ("${results.newFirstName}",
                                            "${results.newLastName}",
                                            "${returnedRoles[roleList.indexOf(results.newRole)].id}",
                                            "${returnedEmployees[employeeList.indexOf(results.newManager)].id}")`)
                            .then(results => {
                                console.log('New employee created.')
                                mainMenuPrompt();
                            })
                    })
                })
        })
}

function mainMenuPrompt() {
    inquirer.prompt(
        {
            type: 'list',
            message: 'What would you like to do?',
            name: "selection",
            choices: menuOptions,
            loop: false
        }
    ).then((response) => {
        switch (response.selection) {
            case 'View all departments':
                displayDepartments();
                break;
            case 'View all roles':
                displayRoles();
                break;
            case 'View all employees':
                displayEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            default:
                db.end();
                break;
        }
    });
};

mainMenuPrompt();