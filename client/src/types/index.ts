export type User = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
};

export type TeamMember = {
    id: number;
    user: User;
}

export type Project = {
    id: number;
    name: string;
    description?: string;
    owner: User;
    team_members: TeamMember[];
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
