# Networking

All pods can communicate with all other pods in a cluster

Clusters can span subnets, cloud fault domains and availability zones

Results in simpelr svc dicscovery and application config

Node network

Nodes in a cluster. 
Each node has an IP address and can reach eachother and other resources on the network

# pod network

Pod network. Each pod has a single IP address assigned to it on the pod network. Depending on it is assigned from the node network but more commonly the IPs are assigned from the pod CIDR range. Eg. calico pod network using a pod CIDR range of 192.168.0.0/16. Pods started in the cluster will get IPM addresses in that range.

What level of management is required to ensure we do not run out of IPs?

Inside a pod, the containers share the same network namespace. So a shared IP and port range to run containers on. Containers can communicate across localhost

Communicating pod to pod within a node, pods will use an interface inside the pod that is attached to a local software bridge or tunnel i/f to communicate with eachother on their actual pod IP addresses

Communicating pod to pod on another node, pods will communicate on their real IP addresses. Done by layer23 connectivity or an overlay network. 


CNI or kubenet

# cni

kubectl get nodes -o wide #provides real ips of nodes on the data centre
kubectl get pods -o wide #pod ips on pod network. These IPs come from the pod CIDR range

kubectl exec -it 'podname' --/bin/sh
>ip addr

kubectl describe node 'node_name' more  #real ip of node
                                        #ip of tunnel network associated with the node


# kubenet

uses bridges and routes in the underlying infrastructure

kubectl get nodes -o wide #provides real ips of nodes on the data centre

Just a collection of virtual machines behind the scenes

kubectl describe nodes | more

Difference with kubenet is that pods on individual nodes get different pod CIDR ranges

Azure provides the routing to decide which node to route to based on the pod CIDR range. Traffic then forwarded into a node hits the bridge which the pod is attached to

Pods route traffic to the bridge in the node. Traffic leaving will hit this and this will forward to the node network.

# Choice

An additional hop is required in the design of kubenet, which adds minor latency to pod communication.
Route tables and user-defined routes are required for using kubenet, which adds complexity to operations.
Direct pod addressing isn't supported for kubenet due to kubenet design.
Unlike Azure CNI clusters, multiple kubenet clusters can't share a subnet.

However, worth the cost for now. Choose kubenet

# DNS



# cluster network

Cluster network. Where cluster ips are reached on

