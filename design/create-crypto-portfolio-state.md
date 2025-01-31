```mermaid
stateDiagram-v2
    User --> QUEUED: CreatePortfolioRequest
    QUEUED --> PROCESSING: MessageQueued
    PROCESSING --> SUCCEEDED: ProcessCompleted
    PROCESSING --> FAILED: ProcessError
    FAILED --> QUEUED: Retry
    SUCCEEDED --> User: Notify
%%    FAILED --> [*]
```
