import express from "express";
import {Employee, File} from "../model/index.js";
import {verifyToken} from "../utility/auth.utility.js";
import logger from "../config/log.config.js";

import multer from 'multer';
const upload = multer({ dest: 'uploads/' })

const router = express.Router();

// Download
router.get('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const file = await File.findByPk(id);
    res.send(file);
})

// downlaod by employee id
router.get('/', verifyToken, async (req, res) => {
    const id = req.query.employeeId;
    logger.info(`Find employee by id ${id}...`);
    const employee = await Employee.findByPk(id, {
        include: File    
    });
    res.send(employee.Files);
})


router.get('/:id/download', verifyToken, async (req, res) => {
    const id = req.params.id;
    const file = await File.findByPk(id);

    const filePath = `./${file.path}`;

    

    res.download(filePath, file.originalname, { 
        headers: { 
            'Content-Type': file.mimetype,
            'Content-Disposition': `attachment; filename=${file.originalname}`
        } 
    }) 
})

// Upload
router.post('/', verifyToken, upload.single('file'), async (req, res) => {
    const file = req.file;
    const employeeId = req.query.employeeId;
    try{
        logger.info(`Find employee by id ${employeeId}...`);
        const employee = await Employee.findByPk(employeeId);
        logger.info('Creating file...' + file.email);
        const createFile = await File.create(file);
        logger.info('File has been created...' + file.email);
        await employee.addFile(createFile);
        logger.info('File has been added to employee...'+ file.email);
        res.send(createFile);
    }catch (error) {
       logger.error('Error creating file...', error.message);
       res.status(500).send(error.message);
    }    
})

// Delete
router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    await File.destroy({where: {id: id}})

    res.send('File has been deleted successfully');
})

export {router}