kubectl delete -f cloud_db_handler.yaml
docker build . -t minninnewah/cloud_db_handler
docker push minninnewah/cloud_db_handler:latest
kubectl apply -f cloud_db_handler.yaml
kubectl get pods