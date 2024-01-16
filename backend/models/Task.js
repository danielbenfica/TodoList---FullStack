const mongoose = require("mongoose")

const {Schema} = mongoose;

const taskSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  status:{
    type: String,
    required: true
  },
  deadLine:{
    type: String,
    required: true
  }
},
  {timestamps: true}
)

const Task = mongoose.model("Task", taskSchema)

module.exports = {Task};