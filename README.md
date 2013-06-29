Show and Tell
=========
Show visuals using just your voice!

![talk](http://www.realfriendforagents.co.uk/wp-content/uploads/fly-solo-with-the-right-tone-of-voice.jpg)

har har har
    
###Tooling Documentation: 
- Google Voice API https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html 
- coffeescript http://coffeescript.org/
- node.js http://nodejs.org/api/index.html
- sass http://sass-lang.com/
- compass http://compass-style.org/reference/compass/

Free video education: http://leveluptuts.com/tutorials



##Requirements:
#####web application framework
    node.js 
    connect 
    express
    npm
    gem
    
#####javascript developement
    coffeescript
#####design framework
    compass (which includes sass)

##Installation:
###install the requirements
    git clone git://github.com/ry/node.git
    cd node
    ./configure; make; make install;
    cd ..
    apt-get install coffeescript (or 'npm install -g coffee-script')
    apt-get install rubygems
    git clone http://github.com/isaacs/npm.git
    cd npm
    sudo make install
    
###install this repo
    apt-get update
    apt-get install git-core
    mkdir show_tell
    cd show_tell
    git init
    git pull git@github.com:danielsnider/show_tell.git
    
###install required modules
    npm install express
    npm install connect
    gem install compass
##Usage:


#Node.js Modules:
    coffeescript
    express
    connect
    
#gem Modules:
    sass

while [ 1 ]; do
    node ./app.js
coffee --watch --compile experimental.coffee
compass watch ./
done
