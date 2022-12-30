
# Cloud cluster
## drone distribution
docker build ./services/drone_distribution -t minninnewah/drone_distribution
docker push minninnewah/drone_distribution:latest

## cloud-db-handler
docker build ./services/cloud_db_handler -t minninnewah/cloud_db_handler
docker push minninnewah/cloud_db_handler:latest

## front-end
docker build ./services/front_end/client -t minninnewah/front_end
docker push minninnewah/front_end:latest

## react-backbone
docker build ./services/front_end/server -t minninnewah/react_backbone
docker push minninnewah/react_backbone:latest

## Speed analysis
docker build ./services/speed_analysis -t minninnewah/speed_analysis
docker push minninnewah/speed_analysis:latest


# Edge cluster
## drone
docker build ./services/drone -t minninnewah/drone
docker push minninnewah/drone:latest

## challenge_handler
docker build ./services/challenge-handler -t minninnewah/challenge_handler
docker push minninnewah/challenge_handler:latest

## edge-db-handler
docker build ./services/edge_db_handler -t minninnewah/edge_db_handler
docker push minninnewah/edge_db_handler:latest

## speed-controller
docker build ./services/speed_controller -t minninnewah/speed_controller
docker push minninnewah/speed_controller:latest
