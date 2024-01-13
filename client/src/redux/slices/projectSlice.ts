import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Project, Task, TeamMember } from "@/types";

type InitialState = {
    project?: Project;
    tasks: Task[];
    teamMembers: TeamMember[];
};

const initialState: InitialState = {
    tasks: [],
    teamMembers: [],
};

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        updateInitialData: (state, action) => {
            state.project = action.payload?.project;
            state.tasks = action.payload?.tasks;
            state.teamMembers = action.payload?.teamMembers;
        },
        addNewTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
        },
        updateTask: (state, action: PayloadAction<Task>) => {
            const taskObjIndex = state.tasks.findIndex((t) => t.id === action.payload.id);
            if (taskObjIndex !== -1) {
                state.tasks[taskObjIndex] = action.payload;
            }
        },
        deleteTask: (state, action: PayloadAction<number>) => {
            const filteredTasks = state.tasks.filter((task) => task.id !== action.payload);
            state.tasks = filteredTasks;
        },
        changeTaskStatus: (state, action) => {
            state.tasks[action.payload?.taskIndex].status = action.payload?.hoverStatus;
        },
        addNewTeamMembers: (state, action: PayloadAction<TeamMember>) => {
            state.teamMembers.push(action.payload);
        },
    },
});

export const { updateInitialData, addNewTask, updateTask, addNewTeamMembers, deleteTask, changeTaskStatus } =
    projectSlice.actions;

export default projectSlice.reducer;
