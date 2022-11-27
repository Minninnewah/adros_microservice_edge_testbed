# cloud_db_handler
wget -O - https:/cloud_db_handler.yaml/raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/services/cloud_db_handler/cloud_db_handler.yaml > cloud_db_handler.yaml
kubectl apply cloud_db_handler.yaml

# cloud_db
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/services/cloud_db/cloud_db.yaml > cloud_db.yaml
kubectl apply cloud_db.yaml

# front_end
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/services/front_end/client/front_end.yaml > front_end.yaml
kubectl apply front_end.yaml

# speed_analysis
wget -O - https://raw.githubusercontent.com/Minninnewah/aucas_microservice_edge_testbed/main/services/speed_analysis/speed_analysis.yaml > speed_analysis.yaml
kubectl apply speed_analysis.yaml
