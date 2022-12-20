const inquirer = require('inquirer');
const db = require('../config/connection');
const cTable = require('console.table');

const update = {

    updateEmployeeRole: function () {
        return new Promise((resolve, reject) => {
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
                                    type: "list",
                                    message: "Which employee's role would you like to update?",
                                    name: "updatedEmployee",
                                    choices: employeeList,
                                    loop: false
                                },
                                {
                                    type: 'list',
                                    message: "What is the new role?",
                                    name: "newRole",
                                    choices: roleList,
                                    loop: false
                                }
                            ]).then(results => {
                                db.promise().query(`UPDATE employees
                            SET role_id = '${returnedRoles[roleList.indexOf(results.newRole)].id}'
                            WHERE id = '${returnedEmployees[employeeList.indexOf(results.updatedEmployee)].id}'`)
                                    .then(results => {
                                        console.log('Employee role updated.')
                                        return resolve();
                                    })
                            })
                        })
                })

        })

    },
    
    updateEmployeeManager: function() {
        return new Promise((resolve, reject) => {
            db.promise().query(`SELECT * FROM employees`)
            .then(results => {
                let returnedEmployees = results[0];
                let employeeList = returnedEmployees.map(el => `${el.first_name} ${el.last_name}`);
                inquirer.prompt(
                    {
                        type: "list",
                        message: "Which employee's manager would you like to update?",
                        name: "updatedEmployee",
                        choices: employeeList,
                        loop: false
                    }
                ).then(results => {
                    let updatedEmployee = results.updatedEmployee;
                    let managerList = [...employeeList];
                    managerList.splice(employeeList.indexOf(updatedEmployee), 1);
                    managerList.push('None');
                    inquirer.prompt(
                        {
                            type: "list",
                            message: "Who will be their new manager?",
                            name: "newManager",
                            choices: managerList,
                            loop: false
                        }
                    ).then(results => {
                        if (results.newManager != 'None') {
                            db.promise().query(`UPDATE employees
                        SET manager_id = '${returnedEmployees[employeeList.indexOf(results.newManager)].id}'
                        WHERE id = '${returnedEmployees[employeeList.indexOf(updatedEmployee)].id}'`)
                                .then(results => {
                                    console.log('Employee manager updated.')
                                    return resolve();
                                })
                        } else {
                            db.promise().query(`UPDATE employees
                        SET manager_id = null
                        WHERE id = '${returnedEmployees[employeeList.indexOf(updatedEmployee)].id}'`)
                                .then(results => {
                                    console.log('Employee manager updated.')
                                    return resolve();
                                })

                        }
                    })
                })

            })

        })
        
    }
}

module.exports = update;