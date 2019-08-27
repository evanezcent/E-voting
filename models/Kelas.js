var mongoose = require('mongoose');

const kelasSchema = new mongoose.Schema({
    kelas :{
        type: String,
        required: true 
    }
});

const Kelas = mongoose.model('Kelas', kelasSchema);

module.exports = Kelas;