#!/bin/sh
echo "starting restart"
sudo git pull git@github.com:danielsnider/show_tell.git
sudo pkill node
// node should auto restart because of ./run.sh 
