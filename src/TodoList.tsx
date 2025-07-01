import React from "react";
import { useState, useEffect, useMemo } from "react";
import TodoItem from "./TodoItem.tsx";

// 定义待办事项的数据类型
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// 筛选类型
type FilterType = "all" | "completed" | "pending";

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  // 从localStorage加载数据
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        const TodosArray = JSON.parse(savedTodos);
        const parsedTodos = TodosArray.map((todo: Todo) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        }));
        setTodos(parsedTodos);
      } catch (error) {
        console.error("加载待办事项失败:", error);
      }
    }
  }, []);
  // 保存数据到localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // 添加待办事项
  const addTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        createdAt: new Date(),
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  // 删除待办事项 单个
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 切换完成状态 单个
  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 编辑待办事项 单个
  const editTodo = (id: number, newText: string) => {
    if (newText.trim() !== "") {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: newText } : todo
        )
      );
    }
  };

  // 使用 useMemo 优化过滤性能
  const filteredTodos = useMemo(() => {
    console.log("🔄 重新计算 filteredTodos"); // 用于调试，可以看到何时重新计算
    switch (filter) {
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "pending":
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]); // 依赖数组：只有 todos 或 filter 变化时才重新计算

  return (
    <div className="todo-container">
      <h1 className="todo-title">📝 My Todo List</h1>

      {/* 输入区域 */}
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo"
          className="todo-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
        />
        <button onClick={addTodo} className="add-button">
          ➕ Add
        </button>
      </div>
      {/* 筛选和统计信息 */}
      <div className="filter-stats">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All:{todos.length}
        </button>
        <button
          className={`filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed:{todos.filter((todo) => todo.completed).length}
        </button>
        <button
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending:{todos.filter((todo) => !todo.completed).length}
        </button>
      </div>
      {/* 待办事项列表 */}
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            {todos.length === 0
              ? "🎉 No todos yet, add one to get started!"
              : `📭 No ${filter} todos found!`}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              todo={todo}
              onDelete={deleteTodo}
              onToggleComplete={toggleComplete}
              onEdit={editTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TodoList;
