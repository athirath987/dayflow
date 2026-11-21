export function sortTasks(tasks, sortBy) {
  const list = [...tasks];
  const priorityWeight = { High: 3, Medium: 2, Low: 1 };

  switch (sortBy) {
    case "Due Date":
      return list.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    case "Priority":
      return list.sort((a, b) => {
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        return weightB - weightA;
      });
    case "Title":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "Newest":
    default:
      return list.sort((a, b) => (b.id || 0) - (a.id || 0));
  }
}
