import express from 'express';
import cookieParser from 'cookie-parser';
import sessionRouter from './routes/sessionRouter.js';
import userRouter from './routes/userRouter.js';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

mongoose.connect('mongodb://localhost:27017/BDPrueba');

const app = express();

//Middlewares
//Middleware de applicacion incorporado por express
app.use(express.json()); //Formatea los cuerpos json de peticiones entrantes (req.body)
app.use(express.urlencoded({extended: true})); //Formatea query params de url para peticiones entrantes..
app.use(express.static('/public' )); // Configura la carpeta donde alojamos los recursos estaticos
app.use(cookieParser()); // Para trabajar con cookies

const mongoURL = '';
mongoose.connect(mongoURL)
    .then( () => console.log("Conexión a base de datos exitosa"))
    .catch( (error) => console.error('Error de conexión: ', error));

app.use(session({
    store: MongoStore.create({ mongoUrl: mongoURL}),
    secret: 'asd3nc3okasod',
    resave: false,
    saveUninitialized: false
}));

//Configuración del motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine','handlebars');

app.get('/setCookie', (req, res) => {
    res.cookie('nombre', 'Tomas', {maxAge: 10000}).send('Cookie seteada');
})

app.use('/api/users', userRouter); 

app.get('/', (req,res)=>{
    res.render('index');
})

app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080');
});