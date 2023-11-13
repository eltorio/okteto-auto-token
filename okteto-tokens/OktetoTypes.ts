export interface ClusterNamespace {
    "namespace": string,
    "nickname": string
}

export interface Cluster {
    "clustername": string,
    "certificate-authority-data": string,
    "server": string,
    "namespaces": ClusterNamespace[],
    "token": string,
    "issued": string,
    "bash_token": string,
}

export interface Authentication {
    apiVersion: string
    metadata: Metadata
    spec: Spec
    status: Status
}

export interface Metadata {
    name: string
    namespace: string
    creationTimestamp: string
    managedFields: ManagedField[]
}

export interface ManagedField {
    manager: string
    operation: string
    apiVersion: string
    time: string
    fieldsType: string
    fieldsV1: FieldsV1
    subresource: string
}

export interface FieldsV1 {
    "f:spec": FSpec
}

export interface FSpec {
    "f:expirationSeconds": FExpirationSeconds
}

export interface FExpirationSeconds { }

export interface Spec {
    audiences: string[]
    expirationSeconds: number
    boundObjectRef: any
}

export interface Status {
    token: string
    expirationTimestamp: string
    namespace?: string
}

export interface KubeconfigCluster {
    cluster: {
        "certificate-authority-data": string,
        server: string
    },
    name: string
}

export interface KubeconfigUser {
    name: string,
    user: {
        token: string
    }
}

export interface KubeconfigContext {
    context: {
        cluster: string,
        namespace: string,
        user: string
    },
    name: string
}

export interface Kubeconfig {
    apiVersion: string,
    clusters: KubeconfigCluster[],
    contexts: KubeconfigContext[],
    users: KubeconfigUser[]
}