kubectl delete -f edge_db_handler.yaml
docker build . -t minninnewah/edge_db_handler
docker push minninnewah/edge_db_handler:latest
kubectl apply -f edge_db_handler.yaml
kubectl get pods