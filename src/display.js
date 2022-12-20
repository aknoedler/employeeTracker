const db = require('../config/connection');
const cTable = require('console.table');

const display = {

    displayDepartments: function () {

        return new Promise((resolve, reject) => {
            db.promise().query('SELECT * FROM departments')
            .then(results => {
                console.table(results[0]);
                return resolve();
            })
        })
        
    },

    displayRoles: function () {

        return new Promise((resolve, reject) => {
            db.promise().query(`SELECT roles.id, roles.title, roles.salary, departments.department
                            FROM roles 
                            LEFT JOIN departments ON roles.department_id = departments.id`)
            .then(results => {
                console.table(results[0]);
                return resolve();
            })
        })
    },

    displayEmployees: function () {

        return new Promise((resolve, reject) => {
            db.promise().query(`SELECT e.id, e.first_name, e.last_name, roles.title,
                            roles.salary, departments.department, 
                            CONCAT(m.first_name, ' ', m.last_name) AS manager
                            FROM employees e
                            LEFT JOIN roles ON e.role_id = roles.id
                            LEFT JOIN departments ON roles.department_id = departments.id
                            LEFT JOIN employees m ON m.id = e.manager_id`)
            .then(results => {
                console.table(results[0]);
                return resolve();
            })
        })
    }
}

module.exports = display;