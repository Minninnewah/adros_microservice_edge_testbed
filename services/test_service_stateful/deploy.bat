kubectl delete -f simple_stateful.yaml
docker build . -t minninnewah/simple_stateful
docker push minninnewah/simple_stateful:latest
kubectl apply -f simple_stateful.yaml
kubectl get pods