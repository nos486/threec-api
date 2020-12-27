import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true },
);

userSchema.methods.findByLogin = async function (login) {
    let user = await this.findOne({
        username: login,
    });

    if (!user) {
        user = await this.findOne({ email: login });
    }
    return user;
};

const User = mongoose.model('User', userSchema);

User.findUser  = async function(regex=/^s/){
    try {
        return User.find({username :  regex}).exec()
    }catch (err){
        return err
    }
}

export default User;