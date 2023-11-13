# Okteto auto tokens library
## Why
If you are working with multiple Okteto workpaces and you interact on them with kubectl it might be difficult to maintain a correct `kube.config`. 

## Idea
The main idea is to maintain only a json file describing your workspaces.  
The json files is populated with some long life (180 days) [personal access token](https://cloud.okteto.com/settings/setup).  One for each Okteto context.  

## Start
Create a `config/clusters.json` according to the sample `config/sample_clusters.json`.  

## Demo tools
### kubeconfig.ts
This simple typescript for generating a `kube.config` automatically with 1 day short life access tokens.  
create a `.env` file:
```sh
PORT="8080"
CLUSTERS_FILE="./config/clusters.json"
```

### index.ts
This is a sample Express server provinding 3 paths:  
- /kube.config returning a YAML formatted kube.config
- /kube.json returning a JSON formatted kube.config
- /token.sh returning a bash script with the long life access tokens as shell variable
Simply start it with:
```sh
npm i
npm run build
npm run start
```

## Don't repeat yourself
For using `clusters.json` in your bash script it is easy to generate the token variables with:   
Example with [yq tool](https://mikefarah.gitbook.io/yq/):  
```sh
eval `cat clusters.json | yq -r '.[] | { (.bash_token): .token} | to_entries | .[] | .key +"=" + (.value | @sh)'`
```
or with [jq tool](https://jqlang.github.io/jq/):
```sh
eval `cat clusters.json | jq -r '.[] | { (.bash_token): .token} | to_entries | .[] | .key + "=" + (.value | @sh)'`
 ```