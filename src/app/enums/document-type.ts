export enum DocumentFileType {
    Document = 1,
    Resource = 2
}

export enum Result {
    Pass = 1,
    Retry = 2
}

export enum Evaluation {
    Evaluated = 1,
    NotEvaluated = 2,
    Retry = 3
}

export enum CompletionStatus {
    Completed = 1,
    NotCompleted = 2,
    Cancelled = 3
}