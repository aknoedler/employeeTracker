const inquirer = require('inquirer');
const db = require('./config/connection');
const cTable = require('console.table');
const display = require('./src/display');
const create = require('./src/create');
const update = require('./src/update');
const remove = require('./src/remove');

const menuOptions = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role',
    'Add an employee',
    'Update an employee role',
    'Update an employee manager',
    'Delete a department',
    'Delete a role',
    'Delete an employee',
    'Exit'
];

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
                display.displayDepartments().then(result => mainMenuPrompt());
                break;
            case 'View all roles':
                display.displayRoles().then(result => mainMenuPrompt());
                break;
            case 'View all employees':
                display.displayEmployees().then(result => mainMenuPrompt());
                break;
            case 'Add a department':
                create.addDepartment().then(result => mainMenuPrompt());
                break;
            case 'Add a role':
                create.addRole().then(result => mainMenuPrompt());
                break;
            case 'Add an employee':
                create.addEmployee().then(result => mainMenuPrompt());
                break;
            case 'Update an employee role':
                update.updateEmployeeRole().then(result => mainMenuPrompt());
                break;
            case 'Update an employee manager':
                update.updateEmployeeManager().then(result => mainMenuPrompt());
                break;
            case 'Delete a department':
                remove.deleteDepartment().then(result => mainMenuPrompt());
                break;
            case 'Delete a role':
                remove.deleteRole().then(result => mainMenuPrompt());
                break;
            case 'Delete an employee':
                remove.deleteEmployee().then(result => mainMenuPrompt());
                break;
            default:
                db.end();
                break;
        }
    });
};

mainMenuPrompt();