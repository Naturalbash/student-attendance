import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  Loader2,
  PlusCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { logActivity } from "../../../utils/activity-logger";

/* =========================
   CONGRATS MODAL
========================= */
const CongratsModal = ({ open, projectTitle, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 30 }}
            transition={{ type: "spring", damping: 18 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              🎉 Project Completed!
            </h2>
            <p className="text-slate-600 mb-6">
              You’ve successfully completed <strong>{projectTitle}</strong>.
              Great job!
            </p>
            <button
              onClick={onClose}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* =========================
   MAIN PAGE
========================= */
const StudentProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedProject, setCompletedProject] = useState(null);

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  /* =========================
     FETCH PROJECTS + TASKS
  ========================= */
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const { data: studentProjects, error: projErr } = await supabase
        .from("student_projects")
        .select("*")
        .eq("student_id", auth.user.id)
        .order("created_at", { ascending: false });

      if (projErr) throw projErr;

      const enriched = await Promise.all(
        studentProjects.map(async (p) => {
          const { data: tasks } = await supabase
            .from("project_tasks")
            .select("*")
            .eq("project_id", p.id)
            .order("created_at", { ascending: true });

          const total = tasks.length;
          const done = tasks.filter((t) => t.completed).length;
          const progress = total > 0 ? Math.round((done / total) * 100) : 0;

          return { ...p, tasks, progress };
        })
      );

      setProjects(enriched);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* =========================
     CREATE NEW PROJECT
  ========================= */
  const createProject = async () => {
    if (!newProjectName) return toast.error("Project name is required");

    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const { error: createErr } = await supabase
        .from("student_projects")
        .insert([
          {
            student_id: auth.user.id,
            name: newProjectName,
            description: newProjectDesc,
          },
        ])
        .select()
        .single();

      if (createErr) throw createErr;

      // Log activity
      await logActivity(`Created project "${newProjectName}"`);

      toast.success("Project created!");
      setNewProjectName("");
      setNewProjectDesc("");

      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project");
    }
  };

  /* =========================
     TOGGLE TASK
  ========================= */
  const toggleTask = async (project, task) => {
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const newCompleted = !task.completed;

      await supabase
        .from("project_tasks")
        .update({ completed: newCompleted })
        .eq("id", task.id);

      const updatedTasks = project.tasks.map((t) =>
        t.id === task.id ? { ...t, completed: newCompleted } : t
      );

      const total = updatedTasks.length;
      const done = updatedTasks.filter((t) => t.completed).length;
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;

      await supabase
        .from("student_projects")
        .update({ progress })
        .eq("id", project.id);

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, tasks: updatedTasks, progress } : p
        )
      );

      // Log activity
      await logActivity(
        `"${task.title}" marked ${newCompleted ? "complete" : "incomplete"}`
      );

      toast.success(
        `"${task.title}" marked ${newCompleted ? "complete" : "incomplete"}`
      );

      if (progress === 100) setCompletedProject(project.name);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  /* =========================
     ADD TASK TO PROJECT
  ========================= */
  const addTask = async (project, taskTitle) => {
    if (!taskTitle) return toast.error("Task title required");
    try {
      const { data: newTask } = await supabase
        .from("project_tasks")
        .insert([{ project_id: project.id, title: taskTitle }])
        .select()
        .single();

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, tasks: [...p.tasks, newTask] } : p
        )
      );

      // Log activity
      await logActivity(
        `Added task "${taskTitle}" to project "${project.name}"`
      );

      toast.success("Task added!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add task");
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold text-slate-900 mb-6">My Projects</h1>

      {/* Create Project Form */}
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

      {/* Projects Grid */}
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
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => {
            const nextTask = project.tasks.find((t) => !t.completed);
            return (
              <div
                key={project.id}
                className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-indigo-600" />
                    <h3 className="font-semibold text-slate-900">
                      {project.name}
                    </h3>
                  </div>
                  <span className="text-sm font-medium text-indigo-600">
                    {project.progress}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-200 rounded-full mb-4">
                  <div
                    className="h-2 bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 mb-4">
                  {project.description || "No description provided."}
                </p>

                {/* Tasks */}
                <ul className="space-y-2 flex-1">
                  {project.tasks.map((task) => {
                    const isNext = nextTask && nextTask.id === task.id;
                    return (
                      <motion.li
                        key={task.id}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition
                          ${
                            task.completed
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-50 hover:bg-slate-100"
                          }
                          ${
                            isNext && !task.completed
                              ? "border border-indigo-300 shadow-sm"
                              : ""
                          }
                        `}
                        onClick={() => toggleTask(project, task)}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-sm font-medium">
                          {task.title}
                          {isNext && !task.completed && (
                            <span className="ml-2 text-xs text-indigo-600 font-normal">
                              (Next)
                            </span>
                          )}
                        </span>
                        {task.completed ? (
                          <CheckCircle className="text-emerald-500" size={18} />
                        ) : (
                          <PlayCircle className="text-slate-400" size={18} />
                        )}
                      </motion.li>
                    );
                  })}
                </ul>

                {/* CTA Button */}
                {nextTask && (
                  <motion.button
                    key={nextTask.id}
                    initial={{ scale: 0.95, opacity: 0.8 }}
                    animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      repeat: 1,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    }}
                    onClick={() => toggleTask(project, nextTask)}
                    className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition"
                  >
                    Continue to "{nextTask.title}"
                  </motion.button>
                )}

                {/* Add Task Form */}
                <TaskForm project={project} addTask={addTask} />
              </div>
            );
          })}
        </div>
      )}

      {/* Congrats modal */}
      <CongratsModal
        open={!!completedProject}
        projectTitle={completedProject}
        onClose={() => setCompletedProject(null)}
      />
    </main>
  );
};

/* =========================
   ADD TASK FORM
========================= */
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

export default StudentProjectsPage;
