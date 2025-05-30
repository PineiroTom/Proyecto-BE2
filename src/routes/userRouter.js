import { Router } from 'express';
import UserDAO from '../DAO/userDAO.js';
import UserRepository from '../dao/userRepository.js';
import mongoose from 'mongoose';

const userDao = new UserDAO();
const userRepository = new UserRepository(userDao);

const router = Router();

router.get('/', async (req, res) => {
    try{
        const users = await userRepository.getUser();
        res.status(200).json({status: 'success', payload: users})
    }
    catch(error){
        console.log(error);
        res.status(400).json({status: 'error', error: error.message})
    }
})

router.post('/', async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body
    try{  
        const newUser = await userRepository.createUser({ first_name, last_name, email, password, age });
        res.cookie('id', newUser._id);
        res.status(201).json({status: 'success', payload: newUser})
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
        const user = await userRepository.getUserById(uid);
        if(!user) throw new Error('User not found');

        const newUser = {
            name: first_name ?? user.first_name,
            last_name: last_name ?? user.last_name,
            age: age ?? user.age,
            password: password ?? user.password,
            email: email ?? user.email
        }

        const updatedUser = await userRepository.updateUser(uid, newUser);
        res.send({status: 'success', payload: updatedUser})

    } catch(error){
        console.log(error);
        res.status(400).send({status: 'error',message: error.message})
    }

})

//Eliminar un usuario
router.delete('/:uid', async (req, res) => {
    const uid  = req.params.uid;
    try{
        await userRepository.deleteUser(uid);
        res.send({status: 'success', payload: { message: 'User deleted' } })

    } catch(error){
        console.log(error);
        res.status(400).send({status: 'error',message: error.message})
    }
})

router.get('/current', async (req, res) => {
    try {
        if (!req.cookies.id) {
            return res.status(401).json({ status: 'error', error: 'No user logged in' });
        }
        const userId = req.cookies.id;
        const user = await userRepository.getUserById(userId);

        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        const userDTO = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age
        };

        res.status(200).json({ status: 'success', payload: userDTO });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', error: error.message });
    }
});

//Ejemplo de como vaciar una cookie o eliminarla
router.get('/logout' ,(req,res) => {
    res.clearCookie('username');
    res.status(200).json({status: 'success', payload: "Sesión cerrada"})
})


export default router