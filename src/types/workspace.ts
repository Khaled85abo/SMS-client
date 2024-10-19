export const ITEM_STATUS = {
    EXIST: "Exist",
    MISSING: "borrowed",
    DAMAGED: "removed"
} as const

export type ItemStatusType = typeof ITEM_STATUS[keyof typeof ITEM_STATUS];

export type Item = {
    name: string
    description: string
    quantity: number
    image: string | null
    box_id: number
    status: ItemStatusType,
    id: number
}

export type Box = {
    "name": string
    "description": string
    "work_space_id": number
    "items": Item[]
    "created_date": string
    "updated_date": string
    "id": number
}

export const WORKSPACE_ROLE = {
    OWNER: "owner",
    ADMIN: "admin",
    VIEWER: "viewer"
} as const


export type Resource = {
    "id": number,
    "name": string,
    "resource_type": string,
    "file_path": string,
    "file_size": number,
    "file_extension": string,
    "description": string | null,
    "tags": string[] | null,
    "version": number,
    "work_space_id": number,
    "user_id": number,
    "created_date": string,
    "updated_date": string | null
}

export type WorkspaceRoleType = typeof WORKSPACE_ROLE[keyof typeof WORKSPACE_ROLE];

export type Workspace = {
    "name": string,
    "description": string,
    "boxes": Box[]
    "created_date": string,
    "updated_date": string | null,
    "role": WorkspaceRoleType,
    "id": number,
    "resources": Resource[]
}

