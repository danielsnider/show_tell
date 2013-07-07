#!/bin/bash

while true
do
if [ ! `pgrep node` ] ; then
sudo node server.js
fi
sleep 5
done
