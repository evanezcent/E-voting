var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nis :{
        type: String,
        required: true 
    },
    nama :{
        type: String,
        required: true 
    },
    kelas :{
        type: String,
        required: true 
    },
    kelamin :{
        type: String,
        required: true 
    },
    status :{
        type: Boolean,
        required: true 
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;