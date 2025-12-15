# Prompt History

**Project:** Todo App Example

**Description:** A simple todo list app built with React and local storage

**Created:** 12/15/2025, 2:00:00 AM
**Last Updated:** 12/15/2025, 2:00:00 AM
**Total Prompts:** 3

---

## Prompt #1

**Date:** 12/15/2025, 2:00:00 AM

**Tags:** `react`, `component`

### Prompt

Create a React component for a todo item that displays the task text and has a checkbox to mark it complete

### Response

Here's a TodoItem component:

```jsx
function TodoItem({ todo, onToggle }) {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
    </div>
  );
}
```

### Note

This worked perfectly as the base component. Later added delete functionality.

---

## Prompt #2

**Date:** 12/15/2025, 2:00:00 AM

**Tags:** `css`, `styling`, `tailwind`

### Prompt

Add Tailwind CSS styling to make the todo item look modern and clean

### Response

Update the component with Tailwind classes:

```jsx
function TodoItem({ todo, onToggle }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 text-blue-500 rounded focus:ring-2"
      />
      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
        {todo.text}
      </span>
    </div>
  );
}
```

### Note

Much better visual design. Users loved the hover effect.

---

## Prompt #3

**Date:** 12/15/2025, 2:00:00 AM

**Tags:** `storage`, `persistence`, `localStorage`

### Prompt

Implement local storage to persist todos across page refreshes

### Response

Add this hook to manage localStorage:

```jsx
function useTodos() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return [todos, setTodos];
}
```

### Note

Critical feature! Made the app actually useful. Remember to handle JSON.parse errors in production.

---
