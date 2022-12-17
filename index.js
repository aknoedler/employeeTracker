const inquirer = require('inquirer');
const prompts = require('./src/prompts');

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

let exit = false;

function mainMenuPrompt () {
    inquirer.prompt(
        {
            type: 'list',
            message: 'What would you like to do?',
            name: selection,
            choices: menuOptions
        }

    ).then(response => {
        switch(response.selection){
            case 'View all departments':
                prompts.displayDepartments;
                break;
            case 'View all roles':
                prompts.displayRoles;
                break;
            case 'View all employees':
                prompts.displayEmployees;
                break;
            case 'Add a departments':
                prompts.addDepartment;
                break;
            case 'Add a role':
                prompts.addRole;
                break;
            case 'Add an employee':
                prompts.addEmployee;
                break;
            case 'Update an employee role':
                prompts.updateEmployeeRole;
                break;
            case 'Exit':
                exit = true;
                break;
        }
        if (!exit){
            mainMenuPrompt();
        } else {
            console.log('Goodbye!');
        }
    })
};

mainMenuPrompt();