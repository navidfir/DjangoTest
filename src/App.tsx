import React, { useState, useEffect, ChangeEvent } from "react";
import routes from "./api/routes";
import { Link } from "react-router-dom";
import ITask from './Data/ITask';
import AddTask from "./components/AddTask";
import UpdateTask from "./components/UpdateTask";
import Tasks from "./components/Tasks";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./Custom.css";

function App() {
  
  {/* Tasks Are Defined Here */}
  const [toDo, setToDo] = React.useState<any[]>([]);

  // Temp State
  const [newTask, setNewTask] = React.useState<any>("");
  const [updateData, setUpdateData] = React.useState<any>("");


  // Api Call



  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = () => {
    routes.getAll()
      .then((response: any) => {
        setToDo(response.data);
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const newTaskAdd = (data:any) => {
    console.log(data);
    routes.create(data)
      .then((response: any) => {
        retrieveData();
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const updateTasks = (id:any,data:any) => {
    routes.update(id,data)
      .then((response: any) => {
        retrieveData();
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(data);
        console.log(e.message);
      });
  };

  const deleteTasks = (id:any) => {
    routes.remove(id)
      .then((response: any) => {
        retrieveData();
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const addTask = () => {
    if (newTask) {
      let num = toDo.length + 1;
      let newEntry = { TaskID: num, TaskDescription: newTask, Status: false };
      newTaskAdd(newEntry);
      setNewTask("");
    }
  };

  const deleteTask = (TaskID: any) => {
    deleteTasks(TaskID);
  };

  const markDone = (id: number) => {
    let tt = { TaskID: id, TaskDescription:"", Status: true };
    let newTask = toDo.map((task) => {
      if (task.TaskID === id) {
        return tt = { TaskID: id, TaskDescription: task.TaskDescription ,Status: !task.status }
      }
      return task;
    });
    console.log(tt);
    updateTasks(tt.TaskID,tt);
  };

  const cancelUpdate = () => {
    setUpdateData("");
  };

  const changeTask = (e: any) => {
    let newEntry = {
      TaskID: updateData.TaskID,
      TaskDescription: e.target.value,
      Status: updateData.Status ? true : false,
    };
    setUpdateData(newEntry);
  };

  const updateTask = () => {
    console.log(updateData);
    let filterRecords = [...toDo].filter((task) => task.TaskID !== updateData.TaskID);
    let updatedObject = [...filterRecords, updateData];
    console.log(updateData);
    updateTasks(updateData.TaskID,updateData);
    setUpdateData("");
  };
  

  //Here We Go For Main App
  return (
    <div className="App">
      <div className="main container">
        <br />
        <br />
        <h2>ToDo Test React TS App + Django + MongoDB</h2>
        <br />
        <br />

        {updateData && updateData ? (
          <UpdateTask
            updateData={updateData}
            changeTask={changeTask}
            updateTask={updateTask}
            cancelUpdate={cancelUpdate}
          />
        ) : (
          <AddTask
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
          />
        )}

        {/* Display ToDos */}
        <div className="noTask">{toDo && toDo.length ? "" : "No Tasks..."}</div>

        <Tasks
          toDo={toDo}
          markDone={markDone}
          setUpdateData={setUpdateData}
          deleteTask={deleteTask}
        />
      </div>
    </div>
  );
}

export default App;
