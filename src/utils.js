import {fileURLToPath} from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
import bCrypt from 'bcrypt';


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

export const __dirname = dirname(__filename);;