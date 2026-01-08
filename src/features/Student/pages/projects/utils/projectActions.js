import supabase from "../../../../../utils/supabase";
import { logActivity } from "../../../../../utils/activity-logger";

export const fetchStudentProjects = async () => {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return [];

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

  return enriched;
};

export const createNewProject = async (name, description) => {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return;

  const { error: createErr } = await supabase
    .from("student_projects")
    .insert([
      {
        student_id: auth.user.id,
        name,
        description,
      },
    ])
    .select()
    .single();

  if (createErr) throw createErr;

  // Log activity
  await logActivity(`Created project "${name}"`);

  return true;
};

export const toggleTaskCompletion = async (project, task) => {
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

  // Log activity
  await logActivity(
    `"${task.title}" marked ${newCompleted ? "complete" : "incomplete"}`
  );

  return {
    updatedTasks,
    progress,
    isCompleted: progress === 100,
  };
};

export const addTaskToProject = async (project, taskTitle) => {
  const { data: newTask } = await supabase
    .from("project_tasks")
    .insert([{ project_id: project.id, title: taskTitle }])
    .select()
    .single();

  // Log activity
  await logActivity(`Added task "${taskTitle}" to project "${project.name}"`);

  return newTask;
};
