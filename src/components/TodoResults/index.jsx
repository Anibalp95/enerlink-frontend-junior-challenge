import "./styles.css";
import { useSelector } from "react-redux";

const TodoResults = () => {

  const done = useSelector((state) => state.todo.done);

  return <div className="todo-results">Done: {done}</div>;
};

export default TodoResults;
