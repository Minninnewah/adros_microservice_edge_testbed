kubectl delete -f simple_stateless.yaml
docker build . -t minninnewah/simple_stateless
docker push minninnewah/simple_stateless:latest
kubectl apply -f simple_stateless.yaml
kubectl get pods