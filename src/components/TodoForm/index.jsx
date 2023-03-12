import { useState } from "react";
import "./styles.css";
import { Button, Stack, TextField } from "@mui/material";
import { addTodo } from "features/todo/todoSlice";
import { useDispatch, useSelector } from "react-redux";

const TodoForm = () => {

  const status = useSelector((state) => state.todo.status);
  const dispatch = useDispatch();
  const [todoName, setTodoName] = useState("");

  const handleTodoSave = async () => {
    try {
      await dispatch(addTodo({ label: todoName })).unwrap();
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setTodoName("");
    }
  }

  const handleEnterPress = (e) => {
    if (e.key === 'Enter' && todoName && status !== "loading") {
      handleTodoSave();
    }
  }

  return (
    <Stack className="todo-form-container" direction={"row"}>
      <TextField
        className="todo-input"
        placeholder="Enter new to do"
        value={todoName}
        size="small"
        onChange={(e) => setTodoName(e.target.value)}
        onKeyDown={(e) => handleEnterPress(e)}
        variant="outlined"
      />
      <Button
        onClick={handleTodoSave}
        disabled={!todoName || status === "loading"}
        variant="contained"
      >
        Add to do
      </Button>
    </Stack>
  )
};

export default TodoForm;
