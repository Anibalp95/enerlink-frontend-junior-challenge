import { useEffect, useState } from "react";
import TodoResults from "./components/TodoResults";
import TodoList from "./components/TodoList";
import TodoForm from "components/TodoForm";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos, setStatus } from "features/todo/todoSlice";
import { Alert, CircularProgress, Snackbar, Stack, Typography } from "@mui/material";


const App = () => {

  const todoState = useSelector((state) => state.todo);
  const dispatch = useDispatch();

  const [openSnack, setOpenSnack] = useState(false);

  useEffect(() => {
    if (todoState.status === 'initial') {
      dispatch(fetchTodos());
    }

    if (todoState.status === 'failed') {
      setOpenSnack(true);
      dispatch(setStatus('idle'));
    }
  }, [todoState.status, dispatch])

  return (
    <div className="root">
      {
        todoState.status === 'fetching' ?
          <Stack direction="column" sx={{ alignItems: "center" }}>
            <Typography>Loading tasks... </Typography>
            <CircularProgress />
          </Stack>
          :
          <>
            <TodoList todoList={todoState.todoList} />
            <TodoResults />
            <TodoForm />
            <Snackbar
              open={openSnack}
              autoHideDuration={3000}
              onClose={() => setOpenSnack(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert onClose={() => setOpenSnack(false)} severity="error" variant="filled">
                Error: {todoState.error}
              </Alert>
            </Snackbar>
          </>
      }
    </div>
  );
};

export default App;
