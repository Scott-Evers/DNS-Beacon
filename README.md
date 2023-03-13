

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

1. Use Helm to deploy to Kubernetes
  ```fish
  helm upgrade --install --namespace dns-beacon --set route53_zone_id=val --set aws_region=us-east-1 --set aws_key=val --set aws_secret=val --set interval=1 --set host_name=fqdn dns-beacon .
  ```

