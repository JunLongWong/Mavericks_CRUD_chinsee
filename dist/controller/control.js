"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.updateEmployee = exports.getEmployees = exports.getEmployeeById = exports.createEmployees = void 0;
const employee_1 = require("../model/employee");
const { employeeSchema } = require('../model/empValidation');
const database_1 = require("../database");
const Emp = [];
const createEmployees = (req, res, next) => {
    const body = req.body;
    const { error } = employeeSchema.validate(body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
    }
    else {
        const name = req.body.name;
        const salary = req.body.salary;
        const department = req.body.department;
        var newEmployeeId = Emp.length;
        var searchid = Emp.findIndex(employee => employee.id === newEmployeeId);
        if (!(searchid < 0)) {
            newEmployeeId = Math.random();
        }
        const newEmployee = new employee_1.EmployeeDef(newEmployeeId, name, salary, department);
        Emp.push(newEmployee);
        res.status(200).json({ message: 'Employee Created Successfully', employeeCreated: newEmployee });
    }
};
exports.createEmployees = createEmployees;
const getEmployeeById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inputEmpId = +req.params.id;
    const response = yield database_1.pool.query('SELECT * from employees where employee_id = $1', [inputEmpId]);
    if (!response.rows.length) {
        res.status(404).json({ message: "Employee could not be found" });
    }
    else {
        res.status(200).json({ message: "Employee Found", employee: response.rows });
    }
});
exports.getEmployeeById = getEmployeeById;
const getEmployees = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield database_1.pool.query('Select * from employees');
    res.status(200).json(response.rows);
});
exports.getEmployees = getEmployees;
//This is to specify the id as type of string
const updateEmployee = (req, res, next) => {
    const body = req.body;
    const { error } = employeeSchema.validate(body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
    }
    else {
        const upName = req.body.name;
        const upSalary = req.body.salary;
        const upDepartment = req.body.department;
        const inputEmpId = +req.params.id;
        const findEmployee = Emp.findIndex(employee => employee.id === inputEmpId);
        if (findEmployee < 0) {
            res.status(404).json({ message: 'Employee could not be found' });
        }
        else {
            const cur = Emp[findEmployee];
            if (cur.name == upName && cur.salary == upSalary && cur.department == upDepartment) {
                res.status(304).json({ message: 'No Change has been made' });
            }
            else {
                Emp[findEmployee] = new employee_1.EmployeeDef(Emp[findEmployee].id, upName, upSalary, upDepartment);
                res.status(200).json({ message: 'Employee Details Updated!', employee: Emp[findEmployee] });
            }
        }
    }
};
exports.updateEmployee = updateEmployee;
const deleteEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inputEmpId = +req.params.id;
    const response = yield database_1.pool.query('SELECT * from employees where employee_id = $1', [inputEmpId]);
    if (!response.rows) {
        res.status(404).json({ message: "Employee could not be found" });
    }
    else {
        yield database_1.pool.query('DELETE from employees where employee_id = $1', [inputEmpId]);
        res.status(200).json({ message: "Employee is deleted", deleted: response.rows });
    }
});
exports.deleteEmployee = deleteEmployee;