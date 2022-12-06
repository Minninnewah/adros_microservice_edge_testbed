kubectl delete -f challenge-handler.yaml
docker build . -t minninnewah/challenge-handler
docker push minninnewah/challenge-handler:latest
kubectl apply -f challenge-handler.yaml
kubectl get pods