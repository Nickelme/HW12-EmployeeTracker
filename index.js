const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "bootcamp",

    // Your password
    password: "password",
    database: "employee_tracker"
});


connection.connect(function (err) {
    if (err) throw (err);
    console.log("EmployeeTracker");
    askquestion();
});


function askquestion() {
    inquirer.prompt({
        type: "list",
        name: "options",
        message: "Options",
        choices: [
            "New Department",
            "List Departments",
            "New Role",
            "List Roles",
            "New Employee",
            "List Employees",
            "Change Role",
            "Exit"
        ]
    }).then(function (response) {
        switch (response.options) {
            case "New Department":
                newDepartment();
                break;
            case "List Departments":
                listDepartments();
                break;
            case "New Role":
                newRole();
                break;
            case "List Roles":
                listRoles();
                break;
            case "New Employee":
                newEmployee();
                break;
            case "List Employees":
                listEmployees();
                break;
            case "Change Role":
                changeRole();
                break;
            case "Exit":
                connection.end();
                break;
        };
    });
}

function newDepartment() {
    inquirer.prompt({
        type: "input",
        name: "department",
        message: "New Department Name"
    }).then(function (response) {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: response.department
            },
            function (err, res) {
                if (err) throw (err);
                console.log("Done!~");
                askquestion();
            }
        );
    });
}


function listDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw (err);
        console.table(res);
        console.log("\n\n");
        askquestion();
    });
};


function newRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw (err);
        var departments = [];
        for (var i = 0; i < res.length; i++) {
            departments.push(res[i].name);
        }
        inquirer.prompt([
            {
                type: "list",
                name: "department",
                message: "Department",
                choices: departments
            },
            {
                type: "input",
                name: "role",
                message: "role"
            },
            {
                type: "input",
                name: "salary",
                message: "Salary"
            }
        ]).then(function (response) {
            var depId = 0;
            for (var i = 0; i < res.length; i++) {
                if (res[i].name == response.department) {
                    depId = res[i].id;
                    break;
                }
            }
            connection.query("INSERT INTO role SET ?",
                {
                    title: response.role,
                    salary: response.salary,
                    department_id: depId
                },
                function (err, res) {
                    if (err) throw (err);
                    console.log("Done!~");
                    askquestion();
                });
        });
    });
};

function listRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw (err);
        console.table(res);
        console.log("\n\n");
        askquestion();
    });
};

function newEmployee() {
    connection.query("SELECT * FROM role", function (err, rolesRes) {
        if (err) throw (err);
        var roles = [];
        for (var i = 0; i < rolesRes.length; i++) {
            roles.push(rolesRes[i].title);
        };
        var managers = ["Nobody"];
        connection.query("SELECT * FROM employee", function (err, ManagersRes) {
            if (err) throw (err);
            for (var i = 0; i < ManagersRes.length; i++) {
                managers.push(ManagersRes[i].first_name + " " + ManagersRes[i].last_name);
            };
            inquirer.prompt([
                {
                    type: "input",
                    name: "fName",
                    message: "First Name"
                },
                {
                    type: "input",
                    name: "lName",
                    message: "Last Name"
                },
                {
                    type: "list",
                    name: "role",
                    message: "Role",
                    choices: roles
                },
                {
                    type: "list",
                    name: "manager",
                    message: "Manager",
                    choices: managers
                }
            ]).then(function (response) {
                var managerSend = null;
                if (response.manager != "Nobody") {
                    for (var i = 0; i < ManagersRes.length; i++) {
                        if ((ManagersRes[i].first_name + " " + ManagersRes[i].last_name) == response.manager) {
                            managerSend = ManagersRes[i].id;
                        }
                    }
                }

                var roleSend = 0;
                for (var i = 0; i < rolesRes.length; i++) {
                    if (response.role == rolesRes[i].title) {
                        roleSend = rolesRes[i].id;
                    }
                }
                connection.query("INSERT INTO employee SET ?",
                    {
                        first_name: response.fName,
                        last_name: response.lName,
                        role: roleSend,
                        manager: managerSend
                    },
                    function (err, res) {
                        if (err) throw (err);
                        console.log("Employee Added!");
                        askquestion();
                    });
            });
        });
    });
};



function listEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw (err);
        console.table(res);
        console.log("\n\n");
        askquestion();
    });
};


function changeRole() {
    connection.query("SELECT * FROM employee", function (err, employeeRes) {
        if (err) throw (err);
        var employeeList = [];
        for (var i = 0; i < employeeRes.length; i++) {
            employeeList.push(employeeRes[i].first_name + " " + employeeRes[i].last_name);
        };
        connection.query("SELECT * FROM role", function (err, roleRes) {
            var roleList = [];
            for (var i = 0; i < roleRes.length; i++) {
                roleList.push(roleRes[i].title);
            };
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Employee",
                    choices: employeeList
                },
                {
                    type: "list",
                    name: "role",
                    message: "Role",
                    choices: roleList
                }
            ]).then(function (response) {
                var newRole = 0;
                for (var i = 0; i < roleRes.length; i++) {
                    if (roleRes[i].title== response.role) {
                        newRole = roleRes[i].id;
                        break;
                    }
                }
                
                var employeeId = 0;
                for(var i=0; i<employeeRes.length; i++){
                    if ((employeeRes[i].first_name + " " + employeeRes[i].last_name) == response.employee){
                        employeeId = employeeRes[i].id;
                    }
                }

                connection.query("UPDATE employee SET ? WHERE ?",
                    [{
                            role: newRole
                        },{
                            id: employeeId
                    }],
                    function (err, res) {
                        if (err) throw (err);
                        console.log("Done!~");
                        askquestion();
                    });
            });
        });
    });
}