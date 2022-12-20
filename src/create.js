const inquirer = require('inquirer');
const db = require('../config/connection');
const cTable = require('console.table');

const create = {

    addDepartment: function () {
        return new Promise((resolve, reject) => {
            inquirer.prompt({
                type: 'input',
                message: 'Enter the new deparment name:',
                name: 'newDepartment'
            })
                .then(results => {
                    db.promise().query(`INSERT INTO departments (department) VALUES ("${results.newDepartment}")`)
                        .then(results => {
                            console.log('New department created.');
                            return resolve();
                        })
                })
        })

    },

    addRole: function () {
        return new Promise((resolve, reject) => {
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
                                console.log('New role created.');
                                return resolve();
                            })
                    })
                })
        })
    },

    addEmployee: function () {
        return new Promise((resolve, reject) => {
            db.promise().query('SELECT * FROM roles')
                .then(results => {
                    let returnedRoles = results[0];
                    let roleList = returnedRoles.map(el => el.title);
                    db.promise().query(`SELECT * FROM employees`)
                        .then(results => {
                            let returnedEmployees = results[0];
                            let employeeList = returnedEmployees.map(el => `${el.first_name} ${el.last_name}`);
                            employeeList.push('None');
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
                                if (results.newManager != 'None') {
                                    db.promise().query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                                        VALUES ("${results.newFirstName}",
                                                "${results.newLastName}",
                                                "${returnedRoles[roleList.indexOf(results.newRole)].id}",
                                                "${returnedEmployees[employeeList.indexOf(results.newManager)]}")`)
                                        .then(results => {
                                            console.log('New employee created.');
                                            return resolve();
                                        })
                                } else {
                                    db.promise().query(`INSERT INTO employees (first_name, last_name, role_id) 
                                        VALUES ("${results.newFirstName}",
                                                "${results.newLastName}",
                                                "${returnedRoles[roleList.indexOf(results.newRole)].id}")`)
                                        .then(results => {
                                            console.log('New employee created.');
                                            return resolve();
                                        })
                                }
                            })
                        })
                })
        })
    }
}

module.exports = create;