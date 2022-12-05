kubectl delete -f drone.yaml
docker build . -t minninnewah/drone
docker push minninnewah/drone:latest
kubectl apply -f drone.yaml
kubectl get pods