import type { Authentication, Cluster, KubeconfigCluster, KubeconfigUser, KubeconfigContext, Kubeconfig } from "./OktetoTypes";
import fs from "fs"
import config from "./config.json"

export function readClustersJson(file: string):Cluster[]{
    return JSON.parse(fs.readFileSync(file).toString()) as Cluster[]
}

export function getAuthentication(namespace: string, authtoken: string): Promise<Authentication> {
    const url: string = `${config.base_url}/${namespace}`;
    return new Promise<Authentication>((resolve, reject) => {
        fetch(url, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${authtoken}`
            }
        }).then(response => {
            (response.json() as Promise<Authentication>).then(values => {
                let retValues = values;
                retValues.status.namespace = namespace;
                resolve(retValues);
            })
        }).catch((reason) => {
            reject(reason)
        })
    })
}

export function getAuthentications(clusters: Cluster[]): Promise<Authentication[]> {
    const promised = [] as Promise<Authentication>[]
    clusters.forEach(cluster => {
        promised.push(getAuthentication(cluster.namespaces[0].namespace, cluster.token))
    })
    return Promise.all(promised)
}

export function getKubeconfigClusters(clusters: Cluster[]) {
    const kubeconfigClusters = [] as KubeconfigCluster[];
    clusters.forEach(cluster => {
        kubeconfigClusters.push({
            cluster: {
                "certificate-authority-data": cluster["certificate-authority-data"],
                "server": cluster.server
            }, name: cluster.clustername
        })
    })
    return kubeconfigClusters
}

export function getKubeconfigUsers(clusters: Cluster[]): Promise<KubeconfigUser[]> {
    const _auths = [] as KubeconfigUser[];
    return new Promise<KubeconfigUser[]>((resolve, reject) => {
        getAuthentications(clusters).then(auths => {
            auths.forEach(auth => {
                _auths.push({
                    name: typeof (auth.status.namespace) == "undefined" ? "" : auth.status.namespace,
                    user: { token: auth.status.token }
                })
            })
            resolve(_auths);
        })
    })
}

export function getkubeconfigContexts(clusters: Cluster[]): KubeconfigContext[] {
    const kubeconfigContexts = [] as KubeconfigContext[];
    clusters.forEach(cluster => {
        cluster.namespaces.forEach(namespace => {
            kubeconfigContexts.push({
                context: {
                    cluster: cluster.clustername,
                    namespace: namespace.namespace,
                    user: cluster.namespaces[0].namespace
                },
                name: namespace.nickname
            })
        })
    })
    return kubeconfigContexts
}



export function getKubeconfig(clusters: Cluster[]): Promise<Kubeconfig> {
    return new Promise<Kubeconfig>((resolve, reject) => {
        getKubeconfigUsers(clusters).then(users => {
            const kubeconfig: Kubeconfig = {
                apiVersion: "v1",
                clusters: getKubeconfigClusters(clusters),
                contexts: getkubeconfigContexts(clusters),
                users: users
            };
            resolve(kubeconfig)
        }).catch(reason=>{
            reject(reason)
        })
    })
}

export function getBashTokens(clusters: Cluster[]): string{
    let retString = "#!/bin/bash";
    clusters.forEach(cluster => {
        retString += `\n# issued: ${cluster.issued}`;
        retString += `\n${cluster.bash_token}="${cluster.token}"`;
    });
    return retString;
}
