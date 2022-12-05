kubectl delete -f drone_distribution.yaml
docker build . -t minninnewah/drone_distribution
docker push minninnewah/drone_distribution:latest
kubectl apply -f drones_distribution.yaml
kubectl get pods