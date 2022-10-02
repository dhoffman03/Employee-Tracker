INSERT INTO department (name)
VALUES  ('Human Resource'),
        ('Engineering'),
        ('Accounting'),
        ('Marketig');

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
VALUES  ('HR Manager', 110000, 1),
        ('Recruiting Coordinator', 50000, 1),
        ('Project Manager', 120000, 2), 
        ('UX Designer', 60000, 2),
        ('Jr. Engineer', 75000, 2),
        ('Accounting Supervisor', 103000, 3),
        ('Financial Analyst', 90000, 3),
        ('Director of marketing', 130000, 4),
        ('Marketing analyst', 69000, 4),
        ('Digital strategist', 72000, 4);

SELECT * FROM role;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Jake', 'Long', 9, 2),
        ('Trixie', 'Carter', 8, NULL),
        ('Kim', 'Possible', 1, NULL),
        ('Ron', 'Stoppable', 2, 3),
        ('Shego', 'Greene', 4, 7),
        ('Danny', 'Fenton', 7, 10),
        ('Jimmy', 'Nuetron', 3, NULL),
        ('Tuker', 'Foley', 5, 7),
        ('Samantha', 'Manson', 10, 2),
        ('Ferb', 'Fletcher', 6, NULL);

SELECT * FROM employee;
