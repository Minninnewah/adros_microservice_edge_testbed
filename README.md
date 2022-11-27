# Auto car speed microservice testbed in edge computing environment

This repository contains the different services for simulating a simple car speed controlling scenario with some front end analysis. Thereby this application is kept pretty simple and only created to have a testbed of different microservices. An important aspect is thereby the the edge computing part. As it is quite normal in an MEC (Multi-access edge computing) this application is split accordingly to the expectations in the response time.

## Edge services
On the edge nodes of the testbed we have the services that requires a low latency to be able to controll the car in real-time. 

##Cloud nodes
On the other side in the cloud nodes we have a big database to be able to do some analysis that doesen't need this low latency.

## Kubernetes environment
To run this application we need at least two clusters, the cloud cluster and one edge cluster. In a more extended scenario you can have multiple edge nodes to move the services or data for MTD, simulating system error or tho follow the cars.

## Communication between clusters
In this environment the communication between the cloud and the edge clusters are done using the TopoFuzzer tool. This is not necessary for each scenario but support the migration of services between different edge clusters sinc we can easily redirect traffic while keeping the connection.

## Quick deployment
Cloud services
```
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/cloud_node_deployment.sh | bash

```

Edge services
```
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/edit/main/edge_node_deployment.sh | bash
```
### Remove container and file
Cloud services
```
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/edit/main/cloud_node_clean_deployment.sh | bash

```

Edge services
```
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/edit/main/edge_node_clean_deployment.sh | bash

```
