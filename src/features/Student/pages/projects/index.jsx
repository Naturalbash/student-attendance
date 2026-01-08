import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  Loader2,
  PlusCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchStudentProjects,
  createNewProject,
  toggleTaskCompletion,
  addTaskToProject,
} from "./utils/projectActions";
import CreateProject from "./components/create-project";
import Projects from "./components/projects";
import CongratsModal from "./components/congrats-modal";

const StudentProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedProject, setCompletedProject] = useState(null);

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    try {
      const enriched = await fetchStudentProjects();
      setProjects(enriched);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async () => {
    if (!newProjectName) return toast.error("Project name is required");

    try {
      await createNewProject(newProjectName, newProjectDesc);

      toast.success("Project created!");
      setNewProjectName("");
      setNewProjectDesc("");

      loadProjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project");
    }
  };

  const toggleTask = async (project, task) => {
    try {
      const result = await toggleTaskCompletion(project, task);

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? { ...p, tasks: result.updatedTasks, progress: result.progress }
            : p
        )
      );

      toast.success(
        `"${task.title}" marked ${!task.completed ? "complete" : "incomplete"}`
      );

      if (result.isCompleted) setCompletedProject(project.name);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  const addTask = async (project, taskTitle) => {
    if (!taskTitle) return toast.error("Task title required");
    try {
      const newTask = await addTaskToProject(project, taskTitle);

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, tasks: [...p.tasks, newTask] } : p
        )
      );

      toast.success("Task added!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add task");
    }
  };
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold text-slate-900 mb-6">My Projects</h1>

      <CreateProject
        newProjectDesc={newProjectDesc}
        setNewProjectDesc={setNewProjectDesc}
        newProjectName={newProjectName}
        setNewProjectName={setNewProjectName}
        createProject={createProject}
      />

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md animate-pulse h-72"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="text-slate-500">No projects yet.</p>
      ) : (
        <Projects
          projects={projects}
          toggleTask={toggleTask}
          addTask={addTask}
        />
      )}

      <CongratsModal
        open={!!completedProject}
        projectTitle={completedProject}
        onClose={() => setCompletedProject(null)}
      />
    </main>
  );
};

export default StudentProjectsPage;
