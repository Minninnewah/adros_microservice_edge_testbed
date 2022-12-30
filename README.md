# Auto drone speed microservice testbed in edge computing environment

This repository contains the different services for simulating a simple drone speed controlling scenario with some front end analysis. Thereby this application is kept pretty simple and only created to have a testbed of different microservices. An important aspect is thereby the the edge computing part. As it is quite normal in an MEC (Multi-access edge computing) this application is split accordingly to the expectations in the response time.

## Edge services
On the edge nodes of the testbed we have the services that requires a low latency to be able to controll the drones in real-time. 

##Cloud nodes
On the other side in the cloud nodes we have a big database to be able to do some analysis that doesen't need this low latency.

## Kubernetes environment
To run this application we need at least two clusters, the cloud cluster and one edge cluster. In a more extended scenario you can have multiple edge nodes to move the services or data for MTD, simulating system error or tho follow the drones.

## Communication between clusters
In this environment the communication between the cloud and the edge clusters are done using the TopoFuzzer tool. This is not necessary for each scenario but support the migration of services between different edge clusters sinc we can easily redirect traffic while keeping the connection.

## Quick deployment
Cloud services
```
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/cloud_node_deployment.sh | bash

```

Edge services
```
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/edge_node_deployment.sh | bash
```
### Remove container and file
Cloud services
```
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/cloud_node_clean_deployment.sh | bash

```

Edge services
```
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/edge_node_clean_deployment.sh | bash

```
### Build Docker images
Build all docker images and upload them to the DockerHub (Docker desktop has to be running and logged in)
```
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/build_all_docker_images.sh | bash
```

## Services
### Edge cluster
#### <ins>challenge-handler)</ins>
##### Description
The role of this service is the creation and verification of JSON Web Tokens (JWT). These tokens are used to send the data between the edge node and the drone. This approach should increase security since we can check that the request is coming from the drone. But in this test environment, a simple key is used which additionally is transmitted at the registration request therefore this should be changed if someone really wants to use this as a security feature. For our use, this service just provides a stateful service (based on stateful code) which is important to provide all types of services.
##### API
- POST /register/:DroneId     //and the key parameter in the body
- DELETE /deregister/:DroneId
- POST /decodeJWT/:DroneId    //And JWT in jwt body parameter
- POST /createJWT/:DroneId    //And speed as body parameter



#### <ins>Speed controller</ins>
##### Description
To get the best speed considering the other drones in the near environment a drone can use this service. To get a speed proposal the drone needs to send its sensor values in JWT to the speed control service. The service then request required information about other drones from the edge-db-handler service. After calculating the new speed for the drone, the information of the drone is also stored using the edge-db-server.
##### API
- POST /  //jwt in body


#### <ins>edge-db-handler</ins>
##### Description
This service has the task of handling the stored data on the edge. It provides access to some data from the local DB and sends new data back to the cloud cluster.
##### API
- GET /:number
- PUT /                      //All drone information in body
- DELETE /:number
- GET /nextDrone/:position  //Get the information of the drone before

#### <ins>edge-db</ins>
##### Description
The role of this service is to provide a DB. For this application, a Postgres DB is used that can be accessed using name: admin, user: admin and password: admin again. Since this is a testbed the focus was not on the security of DB access.

### Cloud cluster
#### <ins>cloud-db-handler</ins>
##### Description
This service has the task of handling the stored data on the cloud.
##### API
- GET /       //get all data
- GET /drones //get the newest data of each drone within the last 15 seconds
- POST /      //add new drone information

#### <ins>cloud-db</ins>
##### Description
The role of this service is to provide a DB. For this application, a Postgres DB is used that can be accessed using name: admin, user: admin and password: admin again. Since this is a testbed the focus was not on the security of DB access.

#### <ins>speed-analysis</ins>
##### Description
This service requests the newest drone information from the cloud-db-handler and creates a list with the different speeds on the controlled route.
##### API
- GET /  

#### <ins>drone-distribution</ins>
##### Description
This service requests the newest drone information from the cloud-db-handler and creates a list with the locations of the drones on the controlled route.
##### API
- GET /

#### <ins>front-end</ins>
##### Description
This service provides the react frontend application to the user. In this front end, the user has two graphics. The first one shows the current speed on the different parts of the route. If there are no drones on some parts of the route then this results in showing the maximum speed since a drone would be able to fly at full speed in this section. The second diagram shows the current distribution of the drones on the route. Thereby each drone is marked with a small circle. Since the focus of this testbed is not the production environment we limited the refresh to a manual refresh of the page from the user.
##### API
- GET /   //returns a webpage

#### <ins>react-backbone</ins>
##### Description
Since the front-end service only provides the website and the requests are done on the clients' devices we are not in the cluster anymore and as a result, don't have access to services to request data to show. Therefore we have this backbone service that is only a gateway to request data from outside the cluster.
##### API
- GET /speed-analysis
- GET /drones-distribution

### <ins>Simulation service</ins>
To generate some data in the microservices we also have a drone service that simulates a drone and repeatedly sends its own information and requests the optimal speed. Also, the registration as well as the deregistration by entering or leaving the controlled route is done. After the drone left the controlled route its information is automatically altered to create a new drone that enters the controlled route.

For deploying on a K8s cluster:
```
docker build ./services/drone -t minninnewah/drone
docker push minninnewah/drone:latest
```
```
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/services/drone/drone.yaml > drone.yaml
kubectl apply -f drone.yaml
```
