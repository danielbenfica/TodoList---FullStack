const {Task: TaskModel} = require("../models/Task");

const taskController = {
  create: async(req, res) => {
    try{
      const task = {
        title: req.body.title,
        status: req.body.status ? req.body.status : "à fazer",
        deadLine: req.body.deadLine
      }

      const response = await TaskModel.create(task)

      res.status(201).json({response, msg:"Tarefa criada com sucesso!"})
    } catch (error){
      res.status(500).json({msg:"[Error] erro ao tentar criar a tarefa"})
    }
  },
  get: async (req, res) => {
    try{
      const id = req.params.id

      const task = await TaskModel.findById(id)

      if(!task){
        res.status(404).json({msg:"Tarefa não encontrada"})
        return;
      } 

      res.status(200).json({task})

    } catch (error){
      res.status(500).json({msg:"[Error] erro ao tentar buscar as tarefas"})
    }
  },
  getAll: async (req, res) => {
    try{
      const tasks = await TaskModel.find()
      
      res.json(tasks)
    } catch (error){
      res.status(500).json({msg:"[Error] erro ao tentar buscar as tarefas"})
    }
  },
  delete: async(req, res) =>{
    try{
      const id = req.params.id 
      const task = await TaskModel.findById(id)

      if(!task){
        res.status(404).json({msg:"Tarefa não encontrada"})
        return;
      }

      const deletedTask = await TaskModel.findByIdAndDelete(id)

      res.status(200).json({deletedTask, msg:"Tarefa deletada com sucesso"})
      
    } catch (error){
      res.status(500).json({msg:"[Error] erro ao tentar deletar as tarefas"})
    }
  },
  update: async(req, res) => {
    try {
      const id = req.params.id

      const task = {
        id: id,
        title: req.body.title,
        status: req.body.status,
        deadLine: req.body.deadLine
      }

      const updateTask = await TaskModel.findByIdAndUpdate(id, task)

      if(!updateTask){
        res.status(404).json({msg:"Tarefa não encontrada"})
        return;
      }

      const updatedTask = await TaskModel.findById(id)

      res.status(200).json({updatedTask, msg:"Tarefa atualizada com sucesso"})

    } catch (error) {
      res.status(500).json({msg:"[Error] erro ao tentar atualizar a tarefa"})
    }
  }
};

module.exports = taskController;