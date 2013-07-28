#!/bin/bash

MUTEX=mutex.lock
if mkdir "$MUTEX"; then
	ssh -i ubuntuUser.pem ubuntu@ec2-54-213-96-212.us-west-2.compute.amazonaws.com;
else
	echo Cannot connect; 
fi

