import {fileURLToPath} from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
import bCrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


/** Creo una funcion flecha en createHash que recibe password como argumento 
 * y genera un SALT (cadena aleatoria de 10 caracteres)
 * - Genera un hash del password usando el SALT
 * - Devuelve el hash
 */

export const createHash = password => bCrypt.hashSync(password, bCrypt.genSaltSync(10));

/**
 * isValidPassword es una función que compara un password dado con un passwordhasheado (almacenado en un objeto user)
 */
/**
 * Creamos una función que recibe un objeto user y un password como argumentos
 * Compara el password ingresado con el password hasheado almacenado en el objeto user
 */
export const isValidPassword = (user, passwordSinHashear) => bcrypt.compareSync(passwordSinHashear, user.password);


/**
 * Una private key sirve para utilizarse al momento de hacer el cifrado del token
 */
const PRIVATE_KEY = "ClaveUltraSecreta";

/**
 * 
 * generateToken: al utilizar jwt.sign:
 * El rpimer argumento es un objeto con la información
 * El segundo argumento es la llave privada con lac ual se realizará el cifrado
 * El tercer argumento es el tiempo de expiración del token
 */
export const generateToken = (user) => {
    const token = jwt.sign(user, PRIVATE_KEY, {expiresIn: '24h'});
    return token;
}

export const authToken = (req, res, next) => {
    //Recordamos que el token viene desde los headers de autorización
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).send({//Si no hay headers, es porque no hay token y por lo tanto no esta autenticado
        error: "Not authenticated"
    });
    const token = authHeader.split(' ')[1]; //Se hace el split para retirar la palabra 'Bearer'
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        //jwt verifica el token existente y corrobora si es un token válido, alterado, expirado, etc.
        if(error) return res.status(403).send( {error: "Not authorized"});
        //Si todo está en orden, se descrifra correctamente el token y se envía al usuario
        req.user = credentials;
        next();
    })
}

export const __dirname = dirname(__filename);;