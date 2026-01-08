import { useState } from "react";

const TaskForm = ({ project, addTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  return (
    <div className="mt-4 flex gap-2">
      <input
        type="text"
        placeholder="Add new task"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="flex-1 border rounded-xl p-2 outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
      />
      <button
        onClick={() => {
          addTask(project, taskTitle);
          setTaskTitle("");
        }}
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
      >
        Add
      </button>
    </div>
  );
};
export default TaskForm;
