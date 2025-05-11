#!/bin/bash
sam deploy
aws s3 cp ./frontend s3://new-bucket-front/ --recursive --acl public-read