const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            maxlength : 64
        },
        hash: {
            type: String,
            maxlength : 128
        },
        path : {
            type: String,
        },
        type  : {
            type: String,
            maxlength : 64
        },
        size  : {
            type: Number,
            maxlength : 20
        },

    },
    { timestamps: true },
);

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret.updatedAt
        delete ret.path
        delete ret._id;
    }
});

const File = mongoose.model('File', schema);

module.exports = File;