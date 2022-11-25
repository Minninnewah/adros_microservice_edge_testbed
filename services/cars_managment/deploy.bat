kubectl delete -f cars_management.yaml
docker build . -t minninnewah/cars_management
docker push minninnewah/cars_management:latest
kubectl apply -f cars_management.yaml
kubectl get pods