var mongoose = require('mongoose');

const kandidatSchema = new mongoose.Schema({
    nama :{
        type: String,
        required: true 
    },
    visi :{
        type: String,
        required: true, 
    },
    misi :{
        type: String,
        required: true 
    },
    foto :{
        type: String,
        required: true 
    },
    tipeFoto :{
        type: String,
        required: true 
    }
});

const Kandidat = mongoose.model('Kandidat', kandidatSchema);

module.exports = Kandidat;