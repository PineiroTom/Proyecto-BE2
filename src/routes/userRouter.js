import { Router } from 'express';
import userModel from '../models/userModel.js';
import mongoose from 'mongoose';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const result = await userModel.find();
        res.status(200).json({status: 'success', payload: result})
    }
    catch(error){
        res.status(400).json({status: 'error', error: error.message})
    }
})

router.post('/', async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body
    try{  
        const result = await userModel.create( { first_name, last_name, email, password, age });
        res.cookie('id', result._id);
        res.status(201).json({status: 'success', payload: result})
    }
    catch(error){
        console.log(error);
        res.status(400).json({status: 'error', error: error.message})
    }
})

//Actualizar un usuario
router.put('/:uid', async (req, res) => {
    const uid = req.params.uid;
    const { first_name, last_name, email, password, age} = req.body;
    try{
        if(!mongoose.Types.ObjectId.isValid(uid)){
            throw new Error('ObjectID es inválido');
        }
        const user = await userModel.findById(uid);
        if(!user) throw new Error('User not found');

        const newUser = {
            name: first_name ?? user.first_name,
            last_name: last_name ?? user.last_name,
            age: age ?? user.age,
            password: password ?? user.password,
            email: email ?? user.email
        }

        const updateUser = await userModel.updateOne({_id: uid}, newUser);
        res.send({status: 'success', payload: updateUser})

    }catch(error){
        res.status(400).send({status: 'error',message: error.message})
    }

})

//Eliminar un usuario
router.delete('/:uid', async (req, res) => {
    const uid  = req.params.uid;
    try{
        const userDeleted = await userModel.deleteOne({_id : uid});
        res.send({status: 'success', payload: userDeleted})

    }catch(error){
        res.status(400).send({status: 'error',message: error.message})
    }
})

//Ejemplo de como vaciar una cookie o eliminarla
router.get('/logout' ,(req,res) => {
    res.clearCookie('username'); 
    res.status(200).json({status: 'success', payload: "Sesión cerrada"})
})


export default router