import { BookOpen, CheckCircle, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import TaskForm from "./task-form";

export default function Projects({ projects, toggleTask, addTask }) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => {
        const nextTask = project.tasks.find((t) => !t.completed);
        return (
          <div
            key={project.id}
            className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="text-indigo-600" />
                <h3 className="font-semibold text-slate-900">{project.name}</h3>
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

            <TaskForm project={project} addTask={addTask} />
          </div>
        );
      })}
    </div>
  );
}
