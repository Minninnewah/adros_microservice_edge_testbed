kubectl delete -f car_distribution.yaml
docker build . -t minninnewah/car_distribution
docker push minninnewah/car_distribution:latest
kubectl apply -f car_distribution.yaml
kubectl get pods