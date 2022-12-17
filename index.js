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

function displayDepartments(){
    db.promise().query('SELECT * FROM departments')
        .then(results => {
        console.table(results[0]);
        mainMenuPrompt();
    })
};

function displayRoles(){
    db.promise().query(`SELECT roles.id, roles.title, roles.salary, departments.department
                        FROM roles 
                        JOIN departments ON roles.department_id = departments.id`)
        .then(results => {
        console.table(results[0]);
        mainMenuPrompt();
    })
};

function displayEmployees(){
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
            case 'Add a departments':
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
            case 'Exit':
                db.end();
                break;
        }
    });
};

mainMenuPrompt();