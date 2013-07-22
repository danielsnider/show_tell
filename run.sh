#!/bin/bash

while true

if [ ! `pgrep mongod` ] ; then
sudo pkill node
sudo mongod
sleep 3
fi

do
if [ ! `pgrep node` ] ; then
sudo node server.js
fi

sleep 5

done