# FlycsvApp - A small application for reading and saving CSV file.

## The application has two major parts 

1. flycsvBackend
    This is backend for the flycsv application, developed in Symfony 5.8.
    
    Backend app has two main entities:
     a. User: It contains the of users in the application.
     b. Employees: It contails the list of employees added by a user, by uploading the csv and saving the data parsed from csv. 

    Backend app has two controllers:
     a. UserController: It have REST endpoints exposed for login, creating, updating and deleting a user.
        /api/login - [POST] - login wuth username and password
        /api/user - [POST] - Create new user
        /api/user/{id} - [PUT, POST] - Update existing user
        /api/user/{id} - [DELETE] - Delete / Remove a user

     b. EmployeeController: It have REST endpoints exposed for saving and getting the daata for employees added by the user 
        /api/employee/savedata - [POST] - save data for employees 
        /api/employee/getdata - [POST] - get employee data for a user

2. fly-csv-app
    This is frontend for the flycsv application, developed in Angular 16.0

    There is single module app.module (root module) in the application.
     a. Login Component - Used by user to login in the application (username: admin, password: admin) 
     b. Home Component - 
        * After successfull login the user will land on the home component. Where user can upload a csv file (Sample file: ./employees.csv)
        * Once the user selects the csv file. The data will be rendered on the same page where user can sort / filter the data by columns Employee ID, First Name, Last Name & Salary.
        * User can view the records and can do two actions Save and Reset.
            Save - Will save the records to employee data for the logged in user.
            Reset - Will reset the uploaded csv and its data.
     c. Records - This components is used to list the employee data saved by a user. User can sort / filter the data by columns Employee ID, First Name, Last Name & Salary.

    Application contains 3 routes:
        * /login
        * /home
        * /records

    Directive : 
        Sortable header for sorting by columns of the table.
    Route Guards :
         Auth Guard to check for loggedin user and allow /home and /records route. (Unauthenticated user will be redirected to /login)
    Pipes :
        Created custom pipe for filtering table of employee based on columns.

    3. MySQL Data
        Database name - flycsv. It have two tables "user" and "employee".

        The sql file for them are provided at root path
            * ./flycsv_employee.sql
            * ./flycsv_user.sql


## Development server

Backend Application:
    - Navigate to ./flycsvBackend folder
    - Run `symfony server:start` for running symfony application.

Frontend Application: 
    - Navigate to ./flycsv-app folder
    - Run `ng serve` for a dev server. 
    - Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Assests 
    Root: 
    * employees.csv (Application is capable of reading with following structure of application)
    * ./flycsv_employee.sql
    * ./flycsv_user.sql