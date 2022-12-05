kubectl delete -f drones_management.yaml
docker build . -t minninnewah/drones_management
docker push minninnewah/drones_management:latest
kubectl apply -f drones_management.yaml
kubectl get pods