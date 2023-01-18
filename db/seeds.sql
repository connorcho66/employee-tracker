USE employeeTracker_DB;


INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, salary, department_id) 
VALUES ("Salesperson", 60000, 1),
       ("Sales Lead", 80000, 1),
       ("Senior Engineer", 100000, 2),
       ("Junior Engineer", 65000, 2),
       ("Accountant", 70000, 3),
       ("Account Manager", 120000, 3),
       ("Lawyer", 120000, 4);


INSERT INTO manager(mgrName)
VALUES ('Q1'),
       ('Q2'),
       ('Q3'),
       ('Q4'),
       ('Q5');



INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('William', 'Riley', 1, NULL),
       ('John', 'Smith', 1, 1),
       ('Alex', 'Slater', 1, 1),
       ('Holly', 'Maxwell', 2, 2), 
       ('Kamron', 'Gibson', 3, 2),
       ('Tom', 'Holland', 4, 3),
       ('Andrew', 'Garfield', 4, 4), 
       ('Connor', 'Cho', 5, 4), 
       ('Keshawn', 'Case', 6, 5), 
       ('Fabian', 'Peck', 7, 5);
