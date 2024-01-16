import {useEffect, useState} from 'react'

import { Trash2, SquarePen, PlusCircle, BadgeCheck  } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2'

import EditTaskModal from './components/editTaskModal';

import './styles/global.css'

function App() {
  const [title, setTitle] = useState("")
  const [deadLine, setDeadLine] = useState("")
  const [tasks, setTasks] = useState([])
  const [isOpenModalEditTask, setIsOpenModalEditTask] = useState(false)
  const [idTaskEditing, setIdTaskEditing] = useState("")

  const filteredTaskWithStatusTodo = tasks.filter(task => task.status === "à fazer")
  const filteredTaskWithStatusFinished = tasks.filter(task => task.status === "concluída")
  const deadLineFormatted = deadLine.split('-').reverse().join('/')

  useEffect(() => {
    async function getAllTasks(){
      const {data} = await axios.get("http://localhost:3001/api/tasks")
      setTasks(data);
    }

    getAllTasks()

  }, [])

  async function createTask(e){
    e.preventDefault()

    try{
      const {data} = await axios.post("http://localhost:3001/api/tasks", {
        title,
        deadLine: deadLineFormatted
      })
      const newTasks = [...tasks, data.response]
      setTasks(newTasks)

      setTitle("")
      setDeadLine("")

    } catch(error){
      console.log(error);
    }

  }

  async function updateTask(updatedTask){
    try {
      const updatedTasks = tasks.map(task => task._id === updatedTask._id ? updatedTask : task)
      setTasks(updatedTasks)
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTask(taskID){

    async function deleteTaskInDatabase(){
      const {data} = await axios.delete(`http://localhost:3001/api/tasks/${taskID}`)
      setTasks(tasks.filter(task => task._id !== taskID))
      console.log(data.msg);
    }

    Swal.fire({
      title: "Deseja mesmo deletar?",
      iconColor: "#F06543", 
      background: "#272727",
      color: "#fff",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2EBFA5",
      cancelButtonColor: "#F06543",
      confirmButtonText: "Sim, deletar"
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          
          deleteTaskInDatabase()
          Swal.fire({
            title: "Deletado!",
            background: "#272727",
            color: "#fff",
            text: "Tarefa deletada com sucesso.",
            icon: "success"
          });
        } catch (error) {
          console.log(error);
        }
      }
    });

   
  }

  async function finishTask(taskToFinish){
    try {

      const {data} = await axios.put(`http://localhost:3001/api/tasks/${taskToFinish._id}`, {
        title: taskToFinish.title,
        status: "concluída",
        deadLine: taskToFinish.deadLine
      })

      const updatedTasks = tasks.map(task => task._id === data.updatedTask._id ? data.updatedTask : task)
      setTasks(updatedTasks)
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className='min-h-screen bg-gray-900 text-zinc-100'>

      {isOpenModalEditTask ? <EditTaskModal taskID={idTaskEditing} controlModalState={setIsOpenModalEditTask} updateTaskDatas={updateTask} /> : ""}

      <div className='px-4'>
        <div className='flex justify-center mb-5'>
          <div className='flex flex-col items-center p-3 w-2/3' >
            <h1 className='text-center font-semibold text-3xl mb-4 p-2'>Minha Lista de Tarefas</h1>
            
            <form className='flex items-center gap-3' onSubmit={createTask}>
              <input onChange={(e) => setTitle(e.target.value)} value={title} className='bg-zinc-700 p-2 w-72 h-10 rounded-md' placeholder='Ex:. Me prepar para a reunião' type="text" />
              <input onChange={(e) => setDeadLine(e.target.value)} value={deadLine} type="date" className='bg-zinc-700 p-2 w-72 h-10 rounded-md' placeholder='Ex:. 01/01/2024' />
              <button onClick={createTask} type='submit' className='flex items-center justify-center bg-zinc-700 h-10 w-10 rounded-lg' >
                <PlusCircle />
              </button>
            </form>

          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          
          <section className=' bg-gray-950'>
            <h2 className='text-center font-bold text-2xl bg-green-600 text-zinc-100 rounded-t-lg'>Concluídas</h2>
            <div className='flex flex-col gap-3 p-6'>
            {filteredTaskWithStatusFinished.map((task) => (
            
                <div key={task._id}>
                <article className='border-2 border-neutral-300 rounded-lg bg-gray-800 py-3 px-3 space-y-3'>
    
                <header className='flex items-center gap-3'>
                  <h2 className='font-semibold text-xl'>{task.title}</h2>
                  <p className='font-semibold text-sm text-zinc-500'>{task.status}</p>
                </header>
    
    
                  <div className=''>
                    <p>{task.deadLine}</p>
                  </div>
    
                  <footer className='flex gap-3'>
                    <button onClick={() => {
                      setIsOpenModalEditTask(true)
                      setIdTaskEditing(task._id)
                      }} className='flex items-center justify-center gap-1 rounded-full bg-[#2EBFA5] w-24 h-8'><SquarePen size={20} /> Editar</button>
                    <button onClick={() => deleteTask(task._id)} className='flex items-center justify-center gap-1 rounded-full bg-[#F06543] w-24 h-8'><Trash2 /> Deletar</button>
                    
                  </footer>
    
                </article>
              </div>
              
            ))}
            </div>
          </section>

          <section className=' bg-gray-950'>
            <h2 className='text-center font-bold text-2xl bg-red-600 text-zinc-100 rounded-t-lg'>À Fazer</h2>
            <div className='flex flex-col gap-3 p-6'>
            {filteredTaskWithStatusTodo.map((task) => (
               <div key={task._id}>
               <article className='border-2 border-neutral-300 rounded-lg bg-gray-800 py-3 px-3 space-y-3'>
   
               <header className='flex items-center gap-3'>
                 <h2 className='font-semibold text-xl'>{task.title}</h2>
                 <p className='font-semibold text-sm text-zinc-500'>{task.status}</p>
               </header>
   
   
                 <div className=''>
                   <p>{task.deadLine}</p>
                 </div>
   
                 <footer className='flex gap-3'>
                   <button onClick={() => {
                     setIsOpenModalEditTask(true)
                     setIdTaskEditing(task._id)
                     }} className='flex items-center justify-center gap-1 rounded-full bg-[#2EBFA5] w-24 h-8'><SquarePen size={20} /> Editar</button>
                  <button onClick={() => deleteTask(task._id)} className='flex items-center justify-center gap-1 rounded-full bg-[#F06543] w-24 h-8'><Trash2 /> Deletar</button>
                  <button onClick={() => finishTask(task)} className='flex items-center justify-center gap-1 rounded-full bg-[#508991] w-24 h-8'><BadgeCheck /> Concluir</button>

                 </footer>
   
               </article>
             </div>
               
              
          
            ))}
            </div>
          </section>
          
        

        </div>
      </div>

    </div>
  )
}

export default App
