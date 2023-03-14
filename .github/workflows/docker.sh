#/bin/bash

echo "Working Directory"
pwd

echo "Directory Contents"
ls -alr

docker build -t {$DOCKERHUB_USER}/dns_beacon -f deploy/Dockerfile .
docker push {$DOCKERHUB_USER}/dns_beacon