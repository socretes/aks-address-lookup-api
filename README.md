# aks-address-lookup-api

Address lookup API is a simple nodejs API exposed that allows a lookup of addresses based on a postcode match. It provides instructions for running locally, running on docker and running on a namespace in AKS.

![Screenshot](container%20address%20lookup.png)

The package.json provides a few commands to help. These work on Windows 

There's also an artillery project coming along that will allow te ability to test scaling

# References

https://vincentlauzon.com/2018/11/28/understanding-multiple-ingress-in-aks/

## Mock

```bash

npm run docker-mock-build
npm run docker-mock-run

```

## Local machine

```bash
npm install
npm run local
curl http://localhost:8080
```

## Local docker

To run on 8080

```bash

npm run docker-image-build
npm run docker-run

curl http://localhost:8080
```

Verify the hostname output matches the CONTAINER ID specified in thie command

```bash
docker container ls
```

To clean up images locally

```bash
npm run docker-container-rm-graceful
```

## AKS pre-requisites

This assumes the following:

integration-resource-group: 'rg-integration'
integration-container-registry: 'rlintegrationservices'

Tag the image

```bash
npm run docker-image-tag
npm run docker-mock-tag
```

## AKS commands prerequisites

```bash

az login

az group list

az group create -n rg-integrationservices -l uksouth

az acr create --resource-group rg-integrationservices --name rlintegrationservices --sku Basic

az acr login --name rlintegrationservices

docker images

az acr repository list --name rlintegrationservices --output table
az acr repository show --name rlintegrationservices --image address-lookup-api:v0
az acr repository show --name rlintegrationservices --image address-lookup-api:v0

npm run docker-push-prod
npm run docker-mock-push-prod

az acr repository list --name rlintegrationservices --output table

az aks create --resource-group rg-integrationservices --name sharedintegrationservices --node-count 2 --generate-ssh-keys --attach-acr rlintegrationservices

az aks get-credentials --resource-group rg-integrationservices --name sharedintegrationservices

```

Run the following to see the resource group that the VMs are deployed

```bash

az aks show -g rg-integrationservices -n sharedintegrationservices --query nodeResourceGroup -o tsv

az network public-ip list -g MC_rg-integrationservices_sharedintegrationservices_uksouth --query [*].ipAddress

```

## AKS commands (dev)

```bash
npm run k8s-yaml-generate-dev

kubectl apply -f namespace.dev.yaml

helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

helm install nginx-group-lookups-dev ingress-nginx/ingress-nginx --namespace group-lookups-dev --set controller.replicaCount=2 --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux --set controller.admissionWebhooks.patch.nodeSelector."beta\.kubernetes\.io/os"=linux --set controller.ingressClass=group-lookups-dev

az network public-ip list -g MC_rg-integrationservices_sharedintegrationservices_uksouth --query [*].ipAddress

kubectl --namespace group-lookups-dev get services

kubectl --namespace group-lookups-dev get services -o wide -w nginx-ingress-ingress-nginx-controller
kubectl get nodes

kubectl apply -f configmap.dev.yaml
kubectl apply -f deployment.dev.yaml
kubectl apply -f service.dev.yaml
kubectl apply -f ingress.dev.yaml

kubectl get pods --namespace group-lookups-dev
kubextl describe pod MY_POD
kubectl get service address-lookup-api --watch --namespace group-lookups-prod
kubectl get ingress group-lookups-ingress --namespace=group-lookups-prod

kubectl exec -it MY_POD --usr/bin/lillall my_app

kubectl get events --watch
kubectl exec -it thispod --container address-lookup-api-mock --/bin/ash
kubectl port-forward address-lookup-api-78fdc459f-44mrt 8080:8080

## AKS commands (prod) - on same cluster as dev but separated by namespace

npm run k8s-yaml-generate-prod

kubectl apply -f namespace.prod.yaml

helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

helm install nginx-group-lookups-prod ingress-nginx/ingress-nginx --namespace group-lookups-prod --set controller.replicaCount=2 --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux --set controller.admissionWebhooks.patch.nodeSelector."beta\.kubernetes\.io/os"=linux --set controller.ingressClass=group-lookups-prod

az network public-ip list -g MC_rg-integrationservices_sharedintegrationservices_uksouth --query [*].ipAddress

kubectl --namespace group-lookups-prod get services

kubectl --namespace group-lookups-prod get services -o wide -w nginx-ingress-group-lookups-prod
kubectl get nodes

kubectl apply -f configmap.prod.yaml
kubectl apply -f deployment.prod.yaml
kubectl apply -f service.prod.yaml
kubectl apply -f ingress.prod.yaml

kubectl get pods --namespace group-lookups-prod
kubectl get service address-lookup-api --watch --namespace group-lookups-prod
kubectl get ingress group-lookups-ingress --namespace=group-lookups-prod

kubectl get events --watch
kubectl exec -it thispod --container address-lookup-api-mock --/bin/ash
kubectl port-forward address-lookup-api-c8c57f855-k2bhg 8090:8090



>ls -l


```

Publish a version 1 and run the following cmd during update

```bash
FOR /L %L IN (0,0,1) DO @(curl http://20.77.128.2/ &  timeout 15 &  echo.)
```

To run a load test, try npm run load-test (you'll have to change the ip address in the package.config). This will be usd to test autoscaling

# Clean up

```bash
az group delete -n rg-integrationservices
az group delete -n NetworkWatcherRG
```

# Liveness/readiness probes

*Liveness

Decided to go TCP
Might want to change the default timeouts for readiness in BW
Might want to look at cmd or HTTP if any issues

Runs a diagnostc check on the container

Per container setting

ON filure the kublet will restart the container according to the container restart policy

GIves K8s a better understanding of our application

* Readiness probes

Run diagnostic checks agianst the containers in the pod

Per container setting

On start up, the ontainer won't receive trafic until ready (ie. readiness probe reports success)

Useful for applications that have a long start up time

Types of diagnostics checks (looks for success, failure or unknown)

EXec - measures the process exit code - ie exec something and look at exit code
tcp socket - check whether we can successfully open  port
httpget - executes a check against a url and looks at returns code of 2* or 3*

kubectl get events --watch #run this to see what happens when we 



## Still TODO

* networking - do this properly

* TLS

* logging/PVs/PVCs - Azure Service monitor

* service mesh - Istio

* Cluster scaling

* DR

* RBAC, service principles, auth - do this properly






