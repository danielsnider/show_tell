#!/bin/sh
cd ec2
chmod 700 kenanPair.pem
ssh -i kenanPair.pem ubuntu@54.218.105.107
