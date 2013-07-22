#!/bin/sh
echo "pulling latest code"
sudo git pull git@github.com:danielsnider/show_tell.git
echo "restarting web server"
sudo pkill node
// node should auto restart because of ./run.sh 
