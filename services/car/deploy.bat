kubectl delete -f car.yaml
docker build . -t minninnewah/car
docker push minninnewah/car:latest
kubectl apply -f car.yaml
kubectl get pods