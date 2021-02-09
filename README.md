https://vincentlauzon.com/2018/11/28/understanding-multiple-ingress-in-aks/

# aks-address-lookup-api

Address lookup API is a simple nodejs API exposed that allows a lookup of addresses based on a postcode match. It provides instructions for running locally, running on docker and running on a namespace in AKS.

The package.json provides a few commands to help. These work on Windows 

There's also an artillery project coming along that will allow te ability to test scaling

## Local machine

```bash
npm install
npm run start
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

az acr repository list --name rlintegrationservices --output table

az aks create --resource-group rg-integrationservices --name sharedintegrationservices --node-count 2 --generate-ssh-keys --attach-acr rlintegrationservices

az aks get-credentials --resource-group rg-integrationservices --name sharedintegrationservices

## AKS commands (dev)

npm run k8s-yaml-generate-dev

kubectl apply -f namespace.dev.yaml

helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

helm install nginx-ingress ingress-nginx/ingress-nginx --namespace group-lookups-dev --set controller.replicaCount=2 --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux --set controller.admissionWebhooks.patch.nodeSelector."beta\.kubernetes\.io/os"=linux

kubectl --namespace group-lookups get services

kubectl --namespace group-lookups get services -o wide -w nginx-ingress-ingress-nginx-controller
kubectl get nodes

kubectl apply -f configmap.dev.yaml
kubectl apply -f deployment.dev.yaml
kubectl apply -f service.dev.yaml
kubectl apply -f ingress.dev.yaml

## AKS commands (prod) - on same cluster as dev but separated by namespace

npm run k8s-yaml-generate-prod

kubectl apply -f namespace.prod.yaml

helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

helm install nginx-ingress ingress-nginx/ingress-nginx --namespace group-lookups-prod --set controller.replicaCount=2 --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux --set controller.admissionWebhooks.patch.nodeSelector."beta\.kubernetes\.io/os"=linux

kubectl --namespace group-lookups get services

kubectl --namespace group-lookups get services -o wide -w nginx-ingress-ingress-nginx-controller
kubectl get nodes

kubectl apply -f configmap.prod.yaml
kubectl apply -f deployment.prod.yaml
kubectl apply -f service.prod.yaml
kubectl apply -f ingress.prod.yaml

kubectl get pods --namespace group-lookups-prod
kubectl get service address-lookup-api --watch --namespace group-lookups-prod
kubectl get ingress group-lookups-ingress --namespace=group-lookups-prod
```

Publish a version 1 and run the following cmd during update

```bash
FOR /L %L IN (0,0,1) DO @(curl http://20.77.128.2/ &  timeout 15 &  echo.)
```

To run a load test, try npm run load-test (you'll have to change the ip address in the package.config). This will be usd to test autoscaling

Clean up

```bash
az group delete -n rg-integrationservices
az group delete -n NetworkWatcherRG
```

## TODO

* Liveness/readiness probes

* Cluster scaling

* TLS

* service mesh - Istio

* logging/PVs/PVCs - Azure Service monitor

* Mocking - decide where and how to communicate

* networking - do this properly

* RBAC, service principles - do this properly

