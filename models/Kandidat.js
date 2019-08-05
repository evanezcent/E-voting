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
    kandidatImg :{
        type: String,
        required: true 
    },
    suara :{
        type: Number
    }
});

const Kandidat = mongoose.model('Kandidat', kandidatSchema);

module.exports = Kandidat;