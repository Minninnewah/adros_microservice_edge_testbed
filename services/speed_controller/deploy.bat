kubectl delete -f speed_controller.yaml
docker build . -t minninnewah/speed_controller
docker push minninnewah/speed_controller:latest
kubectl apply -f speed_controller.yaml
kubectl get pods