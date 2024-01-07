import { Schema ,model } from "mongoose";
import bcrypt from 'bcryptjs';
import JWt from 'jsonwebtoken'
const userSchema = new Schema(
    {
        fullname:{
            type:String,
            required : [true , 'Name is required'],
            minlength: [5 , 'Name must be at least 5 characters'],
            lowercase:true,
            trim:true,
        },

        email:{
            type: String,
            required:[true,'Email is required'],
            unique: true,
            lowercase:true,
            trim:true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please fill in a valid email address',
              ],
        },

        password:{
            type: String,
            required: [true, 'Password is required'],
            minlength:[8,'Password must be at least 8 characters'],
            select:false,
        },
        subscription: {
            id: String,
            status: String,
          },
        avatar:{
            public_id:{
                type:String,
            },
            secure_url:{
                type: String,
            }
        },
        role:{
            type:String,
            enum:['USER','ADMIN'],
            default:'USER'
        },
        forgotPasswordToken:String,
        forgotPasswordExpity: Date,

    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();       
    }
    this.password = await bcrypt.hash(this.password,10)
});


userSchema.methods ={
    generateJWTToken: async function(){
        return await JWt.sign(
            {id:this._id,email:this.email,role:this.role,subscription:this.subscription},
            process.env.SECRET,
            {expiresIn:process.env.JWT_EXPIRY},
        )
    }
}


const User = model('user',userSchema)


export default User