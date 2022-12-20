const inquirer = require('inquirer');
const db = require('../config/connection');
const cTable = require('console.table');

const remove = {
    deleteDepartment: function () {
        return new Promise((resolve, reject) => {
            db.promise().query(`SELECT * FROM departments`)
                .then(results => {
                    let returnedDeps = results[0];
                    let departmentList = returnedDeps.map(el => el.department);
                    inquirer.prompt(
                        {
                            type: "list",
                            message: "Which deparment would you like to delete?",
                            name: "deletedDepartment",
                            choices: departmentList,
                            loop: false
                        }
                    ).then(results => {
                        db.promise().query(`DELETE FROM departments
                    WHERE id = ${returnedDeps[departmentList.indexOf(results.deletedDepartment)].id}`)
                            .then(results => {
                                console.log('Department deleted.');
                                return resolve();
                            })
                    })
                })
        })
    },

    deleteRole: function () {
        return new Promise((resolve, reject) => {
            db.promise().query(`SELECT * FROM roles`)
                .then(results => {
                    let returnedRoles = results[0];
                    let roleList = returnedRoles.map(el => el.title);
                    inquirer.prompt(
                        {
                            type: "list",
                            message: "Which role would you like to delete?",
                            name: "deletedRole",
                            choices: roleList,
                            loop: false
                        }
                    ).then(results => {
                        db.promise().query(`DELETE FROM roles
                    WHERE id = ${returnedRoles[roleList.indexOf(results.deletedRole)].id}`)
                            .then(results => {
                                console.log('Role deleted.');
                                return resolve();
                            })
                    })
                })
        })

    },
    
    deleteEmployee: function() {
        return new Promise((resolve, reject) => {
            db.promise().query(`SELECT * FROM employees`)
            .then(results => {
                let returnedEmployees = results[0];
                let employeeList = returnedEmployees.map(el => `${el.first_name} ${el.last_name}`);
                inquirer.prompt(
                    {
                        type: "list",
                        message: "Which employee would you like to delete?",
                        name: "deletedEmployee",
                        choices: employeeList,
                        loop: false
                    }
                ).then(results => {
                    db.promise().query(`DELETE FROM employees
                    WHERE id = ${returnedEmployees[employeeList.indexOf(results.deletedEmployee)].id}`)
                        .then(results => {
                            console.log('Employee deleted.');
                            return resolve();
                        })
                })
            })
        })
    }
}

module.exports = remove;