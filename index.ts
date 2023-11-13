import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getBashTokens, getKubeconfig, readClustersJson } from './okteto-tokens';
//import clusters from "./config/clusters.json"
import yaml from "js-yaml"

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const clustersFile = process.env.CLUSTER_FILE;

app.get('/kube.config', async (req: Request, res: Response) => {
  res.setHeader('content-type', 'text/plain');
  const clusters = readClustersJson("./config/clusters.json")
  const kubeconfig = await getKubeconfig(clusters);
  res.send(yaml.dump(kubeconfig));
});

app.get('/kube.json', async (req: Request, res: Response) => {
  res.setHeader('content-type', 'application/json');
  const clusters = readClustersJson("./config/clusters.json")
  const kubeconfig = await getKubeconfig(clusters);
  res.send(JSON.stringify(kubeconfig,null,2));
});

app.get('/kube.sh', async (req: Request, res: Response) => {
  res.setHeader('content-type', 'text/plain');
  const clusters = readClustersJson("./config/clusters.json")
  res.send(getBashTokens(clusters));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});