const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PW,
        database: 'employeeTracker_DB'
    },
);

function searchView() {
    return inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'selection',
            choices: [
                'View All Employees',
                'View All Department',
                'View All Roles',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Exit'
            ],
        },
    ])
        .then(choice => {
            switch(choice.selection) {
                case "View All Employees":
                    db.query("SELECT employee.id AS ID, first_name AS `First Name`, last_name AS `Last Name`, title AS Title, salary As Salary, name AS Department, mgrName AS Manager FROM employee JOIN role ON role.id = role_id JOIN department ON department.id = department_id JOIN manager ON manager.id = manager_id", function(err, results) {
                        if(err){
                            console.log(err);
                        } else {
                            console.log("All Employees");
                            console.table(results);
                        }
                    });
                    setTimeout(() => {
                        console.log('-----------');
                        searchView();
                    }, 5);
                    break;

                case 'View All Roles':
                    db.query('SELECT role.id AS ID, title AS Title, name AS Department, salary AS Salary FROM role JOIN department ON department.id = department_id', function (err, results) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('All Roles')
                            console.table(results);
                        }
                    });
                    setTimeout(() => {
                        console.log('-----------');
                        searchView();
                    }, 5);
                    break;

                case 'View All Department':
                    db.query('SELECT name FROM department', function (err, results) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('All Department');
                            console.table(results);

                        }
                    });
                    setTimeout(() => {
                        console.log('-----------');
                        searchView();
                    }, 5);
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

                case 'Exit':
                    console.log('Thank you you are now exiting employee tracker.');
                    break;
            }
        });
};

function updateEmployee() {
    console.log('Here you can update Employee role');

    db.query('SELECT * FROM employee', (err, results) => {
        if(err) {
            console.log(err);
        }
        return inquirer.prompt([
            {
                type: 'rawlist',
                name: 'employeeUpdate',
                choices: function() {
                    var choice = []
                    for (let i = 0; i < results.length; i++) {
                        choice.push(results[i].last_name)
                    }
                    return choice;
                },
                message: "Select employee's role that you want to update"
            },
            {
                type: 'input',
                message: `Assign roles to selected employee`,
                name: 'roleUpdate'
            },
        ])
            .then(response => {
                const updateArray = []
                updateArray.push(response.updRole)
                updateArray.push(response.updEmp)
                db.query(`UPDATE employee SET role_id = ? WHERE last_name = ?`, updateArray, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
                setTimeout(()=> {
                    console.log(`Request to update successfully made!`);
                    searchView();
                }, 5);
            })
    });
};

function addDepartment() {
    console.log("Here you can add new Department");

    return inquirer.prompt([
        {
            type: 'input',
            message: 'What do you want to call new department?',
            name: 'newDepartment'
        },
    ])
        .then(response => {
            db.query(`INSERT INTO department(name) VALUES (?)`, response.newDepartment, (err, result) => {
                if(err) {
                    console.log(err);
                }
            });
            setTimeout(() => {
                console.log(`Successfully added!`);
                searchView();
            }, 5);
        })
};

function addRole() {
    console.log(`Here you can add new role`);

    db.query(`SELECT * FROM department`, (err, results) => {
        if(err){
            console.log(err);
        }
        return inquirer.prompt([
            {
                type: 'input',
                message: `What do you want to call this?`,
                name: 'newRole'
            },
            {
                type:'input',
                message: 'What is the salary of this role?',
                name: 'roleSalary'
            },
            {
                type: 'rawlist',
                name: 'department',
                choices: function() {
                    var choice = []
                    for (let i = 0; i < results.length; i++) {
                        choice.push({
                            name: results[i].name,
                            value: results[i].id
                        })
                    }
                    return choice;
                },
                message: "Select department of this this role."
            }
        ])
            .then(response => {
                addedRole = []
                addedRole.push(response.newRole)
                addedRole.push(JSON.parse(response.roleSalary))
                addedRole.push(response.department)
                db.query(`INSERT INTO role (title, salary, department_id) VALUES(?,?,?)`, addedRole, (err, result) =>{
                    if(err){
                        console.log(err);
                    }
                });
                setTimeout(() => {
                    console.log(`Successfully added`);
                    searchView();
                }, 5);
            });
    });
}

function addEmployee() {
    console.log(`Here you can add new employee`);
    db.query('SELECT * FROM role', (err, results) => {
        if (err) {
            console.log(err);
        }
        return inquirer.prompt([
            {
                type: 'input',
                message: `What is the First Name of employee?`,
                name: 'firstName',
            },
            {
                type: 'input',
                message: `What is the Last Name of employee?`,
                name: 'lastName',
            },
            {
                type: 'rawlist',
                name: 'role',
                choices: function () {
                    var choice = []
                    for (let i = 0; i < results.length; i++) {
                        choice.push({
                                name: results[i].title,
                                value: results[i].id,
                            })

                    }
                    return choice;
                },
                message: "Select role."
            },
            {
                type: 'input',
                message:
                    `Who is the Manager?
                    1) Q1
                    2) Q2
                    3) Q3
                    4) Q4
                    5) Q5
                    Enter number selection:`,
                name: 'manager',
            },
        ])
            .then(response => {
                newEmployee = []
                newEmployee.push(response.firstName)
                newEmployee.push(response.lastName)
                newEmployee.push(response.role)
                newEmployee.push(response.manager)
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, newEmployee, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });

                setTimeout(() => {
                    console.log(`Successfully added!`);
                    searchView();
                }, 5);
            });
    });
}

searchView();