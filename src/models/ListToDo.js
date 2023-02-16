const { Schema, model} = require('mongoose');


const ListToDoSchema = Schema({
    title : {
        type: String,
        required: true,
    },
    task: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    check : {
        type: Boolean
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required : true
    }

});

ListToDoSchema.method('toJSON', function() {
    const { __v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('ListToDo', ListToDoSchema);

