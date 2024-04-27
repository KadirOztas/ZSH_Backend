import express from "express";
import {Employee} from "../model/index.js";
import {verifyToken} from "../utility/auth.utility.js";
import logger from "../config/log.config.js";

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    const employees = await Employee.findAll()
    res.send(employees);
})

router.get('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const employee = await Employee.findByPk(id);
    res.send(employee);
})

router.post('/', verifyToken, async (req, res) => {
    const employee = req.body;
    try{
        logger.info('Creating employee...', employee.email);
        const createEmployee = await Employee.create(employee);
        logger.info('Employee has been created...', employee.email);
        res.send(createEmployee);
    }catch (error) {
       logger.error('Error creating employee...', error.message);
       res.status(500).send(error.message);
    }    
})

router.put('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const employee = req.body;

    const updateEmployee = await Employee.update(employee, {where: {id: id}})
    res.send(updateEmployee);
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    await Employee.destroy({where: {id: id}})

    res.send('Employee has been deleted successfully');
})

export {router}