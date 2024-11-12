export interface LoginResponse {
    statusCode: number,
    message?: string,
    data: any
}

export interface LoginRequest {
    email: string,
    password?: string,
}
