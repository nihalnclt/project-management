export type User = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
};

export type Project = {
    id: number;
    name: string;
    description?: string;
    owner: string;
    created_at: string;
    updated_at: string;
};

export type Task = {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    assignee: User;
};

export enum TaskStatus {
    ToDo = "to-do",
    InProgress = "in-progress",
    Done = "done",
}
