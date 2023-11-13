import clusters from "./config/clusters.json"
import yaml from "js-yaml"
import { getKubeconfig, getKubeconfigClusters, getKubeconfigUsers, getkubeconfigContexts } from "./okteto-tokens";

getKubeconfig(clusters).then(kubeconfig=>{
    console.log(yaml.dump(kubeconfig))
})