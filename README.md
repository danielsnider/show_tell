Show and Tell
=========
Show visuals just using your voice!

![talk](http://www.realfriendforagents.co.uk/wp-content/uploads/fly-solo-with-the-right-tone-of-voice.jpg)

## Dependencies:
-  node.js (with connect and express) - *web application framework* 
-  bootstrap - *front-end developement* 
-  compass (which includes sass) - *design framework* 
-  mongoDB - *database* 
-  jade - *template engine* 
-  npm, gem - *special package managers* 

## Installation:
    su
    apt-get update
    apt-get install git-core
    git clone git://github.com/ry/node.git
    cd node
    ./configure; make; make install;
    cd ..
    apt-get install coffeescript #(or 'npm install -g coffee-script')
    apt-get install rubygems
    gem install compass
    mkdir show_tell
    cd show_tell
    git clone git@github.com:danielsnider/show_tell.git

### How to commit:
    # set your username and email so we can identify you
    git config --global user.name "Daniel Snider"
    git config --global user.email "danielsnider12@gmail.com"
    # set the time correctly
    date -s "30 JUN 2013 05:58"
    export TZ=Toronto
    cd show_tell
    touch test.txt
    git status # notice there is an untracked file?
    git add test.txt # track this file
    git commit 
    # type a commit description like "test commit" and then type ":x" and hit enter to save it and close
    git pull git@github.com:danielsnider/show_tell.git
    git push git@github.com:danielsnider/show_tell.git
    
### Starting webserver:
    $ sudo nohup ./run.sh &
    
### Documentation: 
- Google Voice API https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html 
- bootstrap http://twitter.github.io/bootstrap/base-css.html
- node.js http://nodejs.org/api/index.html
- sass http://sass-lang.com/
- compass http://compass-style.org/reference/compass/
- mongoDB http://docs.mongodb.org/manual/
- jade http://jade-lang.com/command-line/

####Login system example code:
https://github.com/braitsch/node-login

### Google Document for comments:
https://docs.google.com/document/d/1PsP9Rb0oEkOZE9ePCAP10lA9yCaiuAe6IfyX3sp4pjo/edit?usp=sharing
