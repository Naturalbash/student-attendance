import { useState } from "react";
import { FileText, CheckCircle, PlayCircle, Clock } from "lucide-react";

/* =======================
   MOCK DATA
======================= */
const studentProjects = [
  {
    id: 1,
    title: "Portfolio Website",
    description:
      "Build a personal portfolio website using HTML, CSS, and React.",
    status: "In Progress",
    progress: 50,
    deadline: "2025-12-25",
  },
  {
    id: 2,
    title: "E-commerce UI Design",
    description: "Design a responsive e-commerce app interface in Figma.",
    status: "Completed",
    progress: 100,
    deadline: "2025-11-30",
  },
  {
    id: 3,
    title: "Data Analysis with Python",
    description:
      "Analyze dataset and create visual insights using Pandas and Matplotlib.",
    status: "Pending",
    progress: 0,
    deadline: "2026-01-15",
  },
  {
    id: 4,
    title: "Social Media Marketing Plan",
    description: "Develop a comprehensive social media strategy for a brand.",
    status: "In Progress",
    progress: 30,
    deadline: "2026-01-05",
  },
];

/* =======================
   COMPONENTS
======================= */
const ProjectCard = ({ project }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-lg transition">
    {/* Header */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <FileText className="text-indigo-600" size={24} />
        <h3 className="text-lg font-semibold text-slate-900">
          {project.title}
        </h3>
      </div>
      <span
        className={`text-sm font-medium px-2 py-1 rounded-full ${
          project.status === "Completed"
            ? "bg-emerald-100 text-emerald-700"
            : project.status === "In Progress"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-rose-100 text-rose-700"
        }`}
      >
        {project.status}
      </span>
    </div>

    {/* Description */}
    <p className="text-sm text-slate-500 mb-3">{project.description}</p>

    {/* Progress bar */}
    <div className="w-full h-2 bg-slate-200 rounded-full mb-4">
      <div
        className={`h-2 rounded-full ${
          project.progress === 100 ? "bg-emerald-600" : "bg-indigo-600"
        }`}
        style={{ width: `${project.progress}%` }}
      />
    </div>

    {/* Footer: deadline + actions */}
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Clock size={16} />
        <span>Deadline: {project.deadline}</span>
      </div>
      <button
        className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
          project.status === "Completed"
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {project.status === "Completed" ? (
          <>
            <CheckCircle size={14} />
            View
          </>
        ) : (
          <>
            <PlayCircle size={14} />
            Continue
          </>
        )}
      </button>
    </div>
  </div>
);

/* =======================
   MAIN PAGE
======================= */
const MyProjectsPage = () => {
  const [projects] = useState(studentProjects);
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
          <p className="text-sm text-slate-500">
            Track your ongoing and completed projects
          </p>
        </div>

        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* PROJECTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {filteredProjects.length === 0 && (
          <p className="text-slate-500 col-span-full text-center">
            No projects found.
          </p>
        )}
      </div>
    </main>
  );
};

export default MyProjectsPage;
