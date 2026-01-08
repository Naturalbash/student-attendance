import { PlusCircle } from "lucide-react";

export default function CreateProject({
  newProjectDesc,
  setNewProjectDesc,
  newProjectName,
  setNewProjectName,
  createProject,
}) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-md mb-6 flex flex-col gap-3">
      <input
        type="text"
        placeholder="Project Name"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
        className="border rounded-xl p-2 outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <textarea
        placeholder="Project Description"
        value={newProjectDesc}
        onChange={(e) => setNewProjectDesc(e.target.value)}
        className="border rounded-xl p-2 outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <button
        onClick={createProject}
        className="bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
      >
        <PlusCircle className="inline mr-2" /> Create Project
      </button>
    </div>
  );
}
