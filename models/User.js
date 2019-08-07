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
    deleteStatus :{
        type: Boolean,
    },
    status :{
        type: Boolean,
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;