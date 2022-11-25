kubectl delete -f speed_analysis.yaml
docker build . -t minninnewah/speed_analysis
docker push minninnewah/speed_analysis:latest
kubectl apply -f speed_analysis.yaml
kubectl get pods