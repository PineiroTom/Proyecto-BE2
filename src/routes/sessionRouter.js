import {Router} from 'express';
import User from '../models/userModel.js';
import { createHash, isValidPassword } from '../utils.js';

const router = Router();

//Registración
router.post('/register', async (req, res) => {
    try{
        const { first_name, last_name, email, age, password} = req.body;

        if(!first_name || !last_name || !email || !age || !password){
            return res.status(400).send({status: false, message: "Todos los campos son requeridos"});
        }

        let newUser = new User({
            first_name,
            last_name,
            email,
            age,
            role,
            password: createHash(password)
        })

        await newUser.save();
        res.status(201).send({
            status: true,
            message: "Usuario registrado exitosamente",
        });

        res.redirect("/user/current");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    
})

//Iniciar sesión
router.post('/login', async (req, res) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){//Verifico que no vengan vacíos
            return res.status(400).send({status: false, message: "Todos los campos son requeridos"});
        }

        //Buscamos el usuario a traves del email, no es necesario buscarlo por contraseña
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).send("Usuario no encontrado");
        }

        if(!isValidPassword(user,password)){
            return res.status(403).send("Contraseña incorrecta")
        }

        const jwt_token = generateToken({
            userId: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            age: user.age
        });

        res.cookie("currentUser", jwt_token, { httpOnly: true });
        res.redirect("/user/current");
        } catch (error) {
            console.log(`Error al iniciar sesión ${error}`);
            res.status(400).send("Error al iniciar sesión");
        }
})

//Cerrar sesión del usuario
router.post('/logout', (req, res) => {
    res.clearCookie("currentUser");
    res.redirect("/user/login");
})

//Ruta POST para manejar la restauración de contraseña
router.post('/restore-password', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({status: false,message: "Email y nueva contraseña son requeridos",});
    }
    try{
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(404).send({ status: false, message: "Usuario no encontrado" });
        }
        user.password = createHash(password);
        await user.save();
        res.redirect('/login');
    }catch(error){
        return res.status(500).send("Error al restaurar la contraseña");
    }
});

export default router;