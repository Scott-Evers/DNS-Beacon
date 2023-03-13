

## Environment
* ZONE_ID
* AWS_REGION
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY

## Build Process
1. Build and publish the container image
  ```fish
  set -x DOCKERHUB_USER dockerhub_user
  docker build -t {$DOCKERHUB_USER}/dns_beacon -f deploy/Dockerfile .
  docker push {$DOCKERHUB_USER}/dns_beacon
  ```

2. Use Helm to deploy to Kubernetes