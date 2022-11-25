kubectl delete -f front_end.yaml
docker build . -t minninnewah/front_end
docker push minninnewah/front_end:latest
kubectl apply -f front_end.yaml
kubectl get pods