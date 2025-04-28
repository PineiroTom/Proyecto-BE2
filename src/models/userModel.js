import mongoose from 'mongoose';
import { createHash} from '../utils.js'

const usercollection = "users";

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    age: {type: Number, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true, default: "user"}
});

userSchema.pre('save', function(next){
    if(!this.isModified('password')) return next();
    this.password = createHash(this.password);
    next();
})

export const userModel = mongoose.model(usercollection, userSchema);

export default userModel;