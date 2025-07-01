import React, { useState } from "react";

// 定义待办事项的数据类型
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}
// 单个待办事项组件
interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

function TodoItem({ todo, onDelete, onToggleComplete, onEdit }: TodoItemProps) {
  const [editText, setEditText] = useState(todo.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    if (editText.trim() !== "") {
      onEdit(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo.id)}
        className="todo-checkbox"
      />
      {isEditing ? (
        <div className="edit-section">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="edit-input"
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="edit-buttons">
            <button onClick={handleEdit} className="save-button">
              ✅
            </button>
            <button onClick={handleCancel} className="cancel-button">
              ❌
            </button>
          </div>
        </div>
      ) : (
        <div className="no-editing">
          <span
            className={`todo-test ${todo.completed ? "completed-text" : ""}`}
            title="double click to edit"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.text}
          </span>
          <div className="todo-actions">
            <button
              onClick={() => setIsEditing(true)}
              className="edit-button"
              title="edit"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="delete-button"
              title="delete"
            >
              🗑️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default TodoItem;
