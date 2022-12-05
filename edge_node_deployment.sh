
# edge_db
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/services/edge_db/edge_db.yaml > edge_db.yaml 
kubectl apply -f edge_db.yaml 

# edge_db_handler
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/services/edge_db_handler/edge_db_handler.yaml > edge_db_handler.yaml
kubectl apply -f edge_db_handler.yaml

# speed_controller
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/services/speed_controller/speed_controller.yaml > speed_controller.yaml
kubectl apply -f speed_controller.yaml

# drones_management
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/services/drones_managment/drones_management.yaml > drones_management.yaml
kubectl apply -f drones_management.yaml
