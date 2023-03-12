import React from "react";
import "./styles.css";
import TodoListItem from "components/TodoListItem";
import { useDispatch } from "react-redux";
import { checkTodo, deleteTodo, toggleTask } from "features/todo/todoSlice";

const TodoList = ({ todoList }) => {

  const dispatch = useDispatch();

  const handleDelete = async (todoId) => {
    dispatch(deleteTodo({ id: todoId }));
  };

  const toggleCheck = async (todoId, isChecked) => {
    dispatch(checkTodo({ id: todoId, checked: isChecked }));
  };

  return (
    <div className="todo-list">
      <span className="todo-list-title">Things to do:</span>
      {
        todoList.length === 0 ?
          <div className="no-todos">
            Looks like you&apos;re absolutely free today!
          </div> :
          <div className="todo-list-content">
            {todoList.map((todoListItem) =>
              // Added this react fragment to add a key to each rendered component
              <React.Fragment key={"todo" + todoListItem.id}>
                <TodoListItem
                  onCheck={() => toggleCheck(todoListItem.id, !todoListItem.checked)}
                  checked={todoListItem.checked}
                  onDelete={() => handleDelete(todoListItem.id)}
                  label={todoListItem.label}
                />
              </React.Fragment>
            )}
          </div>
      }
    </div>
  );
};

export default TodoList;
