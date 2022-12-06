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

## Services
### Edge cluster
#### <ins>challenge-handler)</ins>
##### Description
The role of this service is the creation and verifycation of json web tokens. This tokens are used to send the data between the edge node and the drone. This approach should increase the security since we can check that the request is comming from the drone. But in this test environment a simple key is used which addtionally is transmited at the register request and therefore this should be changed if someone really want to use this as a security feature. For our use this service just provide a statefull service (based on stateful code) which is important to provide all types of services.
##### API
- POST /register/:DroneId     //and the key parameter in the body
- DELETE /deregister/:DroneId
- POST /decodeJWT/:DroneId    //And JWT in jwt body parameter
- POST /createJWT/:DroneId    //And speed as body parameter



#### <ins>Speed controller</ins>
##### Description
To get the best speed considering the other drones in the near environment a dron can use this service. To get a speed proposal the drone needs to send their sensor values in JWT to the speed service. The speed service then request required information about other drones from the edge-db-handler service. After calculating the new speed for the drone, the information of the dron are also stored using the edge-db-server.
##### API


#### <ins>edge-db-handler</ins>
This service has the task of handling the stored data on the edge. It provides access to some data from the local db and send new data back to the cloud cluster.
##### Description
##### API
- GET /:number
- PUT                       //All drone information in body
- DELETE /:number
- GET /nextDrone/:position  //Get the information of the drone before

#### <ins>edge-db</ins>
##### Description
A simple postgres db instance.

### Cloud cluster
#### <ins>cloud-db-handler</ins>
##### Description
The role of this service is to provide an API to the db.
##### API
- GET /       //get all data
- GET /drones //get the newest drone information
- POST /      //add new drone information

#### <ins>cloud-db</ins>
##### Description
A simple postgres db instance.

#### <ins>speed-analysis</ins>
##### Description
This service request the newest drone information from the cloud-db-handler nad reacte a list with the different speeds on the controlled route.
##### API
- GET /  

#### <ins>drone-distribution</ins>
##### Description
This service request the newest drone information from the cloud-db-handler nad reacte a list with the locationsof the drones on the controlled route.
##### API
- GET /

#### <ins>front-end</ins>
##### Description
This service provides the react frontend application to the user.
##### API
- GET /   //returns a webpage

#### <ins>react-backbone</ins>
##### Description
Since the front-end service only provides the website and the requests are done on the clients device we are not in the cluster anymore and as a result don't have access to services to request data to show. Therefore we have this backend service that is only a gateway to reqest data from outside the cluster.
##### API
- GET /speed-analysis
- GET / drones-distribution

### <ins>Simulation service</ins>
To generate some data in the microservices we also have a drone service that simulate a drone and repeatedly sends it's own information and request the optimal speed. Also the registration as well as the deregistration by entering or leaving the controlled route is done. After the drone left the controlled route it's information are automatically altered to create a new drone that enters the controlled route.
