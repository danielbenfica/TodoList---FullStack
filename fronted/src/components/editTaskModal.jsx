import axios from "axios"
import { useEffect, useState } from "react"

export default function EditTaskModal({taskID, controlModalState, updateTaskDatas}) {
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState("")
  const [deadLine, setDeadLine] = useState("")

  useEffect(() => {

    async function getTaskDatas(){
      const {data} = await axios.get(`http://localhost:3001/api/tasks/${taskID}`)
      setTitle(data.task.title)
      setStatus(data.task.status)
      setDeadLine(data.task.deadLine)

      console.log(data.task.title);
    }

    getTaskDatas()
  }, [taskID])

  async function editTask(e){
    e.preventDefault()

    
    const {data} = await axios.put(`http://localhost:3001/api/tasks/${taskID}`, {
      title,
      status,
      deadLine
    })

    updateTaskDatas(data.updatedTask)
    controlModalState(false)
  }

  return (
    <div className='flex items-center justify-center bg-[#00000086] fixed top-0 bottom-0 left-0 right-0'>
      <div className='flex flex-col justify-center bg-[#272727] w-2/5 h-2/3 px-8 rounded-lg gap-10'>
        <h2 className="text-center text-3xl font-semibold">Editar Tarefa</h2>
        <form className="flex flex-col w-full gap-2" onSubmit={editTask}>

          <label htmlFor="title" className="text-zinc-300 font-semibold">Título:</label>
          <input required onChange={(e) => setTitle(e.target.value)} id="title" value={title} className="bg-zinc-900 h-10 p-2 rounded-md" type="text" />
          <label htmlFor="status" className="text-zinc-300 font-semibold">Status:</label>
          {/* <input required onChange={(e) => setStatus(e.target.value)} id="status" value={status} className="bg-zinc-900 h-10 p-2 rounded-md" type="text" /> */}
          <select onChange={(e) => setStatus(e.target.value)} value={status} required className="bg-zinc-900 h-10 p-2 rounded-md" id="status">
            <option>à fazer</option>
            <option>concluída</option>
          </select>
          <label htmlFor="deadLine" className="text-zinc-300 font-semibold">Data de Conclusão:</label>
          <input required onChange={(e) => setDeadLine(e.target.value)} id="deadLine" value={deadLine} className="bg-zinc-900 h-10 p-2 rounded-md" type="text" />

          <div className="flex justify-between mt-10">
            <button onClick={() => controlModalState(false)} className="flex items-center justify-center rounded-full bg-[#F06543] h-8 px-10 py-6">Descartar</button>
            <button type="submit" className="flex items-center justify-center rounded-full bg-[#2EBFA5] h-8 px-10 py-6">Salvar</button>
          </div>

        </form>
      </div>
    </div>
  )
}

// export default editTaskModal
