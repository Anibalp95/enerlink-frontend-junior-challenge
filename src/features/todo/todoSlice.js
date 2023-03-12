import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    // todo example: {id: 0, label: 'Fix an ability to display all tasks', checked: false}
    todoList: [],
    status: 'initial', // posible status: initial | idle | loading | success | failed
    error: null,
    done: 0
}

export const fetchTodos = createAsyncThunk(
    'todo/fetchTodos',
    async () => {
        const res = await axios.get("https://my-json-server.typicode.com/AlvaroArratia/static-todos-api/todos");

        return res.data
    })

export const addTodo = createAsyncThunk(
    'todo/addTodo',
    // newTodo has the shape {label: str}
    async (newTodo) => {
        const res = await axios.post("https://my-json-server.typicode.com/AlvaroArratia/static-todos-api/todos", newTodo);

        return res.data;
    }
)

export const checkTodo = createAsyncThunk(
    'todo/checkTodo',
    // todoData has the shape {id: int, checked: bool}
    async (todoData) => {
        const res = await axios.patch(`https://my-json-server.typicode.com/AlvaroArratia/static-todos-api/todos/${todoData.id}`, { checked: todoData.checked });

        return res.data;
    }
)

export const deleteTodo = createAsyncThunk(
    'todo/deleteTodo',
    // todoData has the shape {id: int}
    async (todoId) => {
        await axios.delete(`https://my-json-server.typicode.com/AlvaroArratia/static-todos-api/todos/${todoId.id}`);

        return todoId;
    }
)

const isRejectedAction = (action) => {
    return action.type.endsWith('rejected');
}

const isLoadingAction = (action) => {
    if (!action.type.includes("fetchTodos") && action.type.endsWith('pending')) return true;
    return false;
}

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchTodos.pending, (state, action) => {
                state.status = 'fetching';
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.status = 'succeded';
                state.todoList = action.payload;
            })
            .addCase(addTodo.fulfilled, (state, action) => {
                state.status = 'succeded'
                state.todoList.push(action.payload);
            })
            .addCase(addTodo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(checkTodo.fulfilled, (state, action) => {
                state.status = 'succeded';
                const todoIdx = state.todoList.findIndex((todo) => todo.id === action.payload.id);
                state.todoList[todoIdx].checked = action.payload.checked;
                action.payload.checked ? state.done += 1 : state.done -= 1;
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                const wasChecked = state.todoList.find((todo) => todo.id === action.payload.id).checked;
                
                // Remove todo from todoList
                state.todoList = state.todoList.filter((todo) => todo.id !== action.payload.id);

                // -1 to done if the removed todo was checked
                if (wasChecked) state.done -= 1;
            })
            .addMatcher(
                isRejectedAction,
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.error.message;
                }
            )
            .addMatcher(
                isLoadingAction,
                (state) => {
                    state.status = 'loading';
                }
            )
    }
})

export const { setStatus } = todoSlice.actions;
export default todoSlice.reducer;