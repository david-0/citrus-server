# citrus-server
Citrus-Server

## Postgre access
sudo -u postgres -i
psql citrus


## pm2 installation
###
npm install -g pm2
pm2 install pm2-logrotate


# letsencrypt on 88.99.118.38 (alixon)
##install certbot
https://certbot.eff.org/lets-encrypt/ubuntubionic-other
add-apt-repository ppa:certbot/certbot
apt-get update
apt-get install certbot

## run certbot initially
certbot certonly --standalone
>> email address >> david.leuenberger@gmx.ch
>> Agree >> yes
>> Share email >> no

## config node-server
cd /home/alixon/usr/davidl/website/citrus/certificate/ssl
ln -s /etc/letsencrypt/live/shop.el-refugio-denia.com/cert.pem
ln -s /etc/letsencrypt/live/shop.el-refugio-denia.com/privkey.pem
ln -s /etc/letsencrypt/live/shop.el-refugio-denia.com/chain.pem

## chmod permissions 
setfacl -m u:davidl:rx /etc/letsencrypt/archive
setfacl -m u:davidl:rx /etc/letsencrypt/live
setfacl -m u:davidl:r /etc/letsencrypt/archive/shop.el-refugio-denia.com/privkey1.pem

## pre and post hooks
cat > /etc/letsencrypt/renewal-hooks/pre/stopCitrusServer.sh << EOF
#!/bin/bash

cd /home/alixon/usr/davidl/website/citrus/citrus-server 
su davidl -c "forever stop dist/app.js"

EOF
chmod 700 /etc/letsencrypt/renewal-hooks/pre/stopCitrusServer.sh

cat > /etc/letsencrypt/renewal-hooks/post/startCitrusServer.sh << EOF
#!/bin/bash

cd /home/alixon/usr/davidl/website/citrus/citrus-server 
export NODE_ENV=production
su davidl -c "forever start dist/app.js"

EOF
chmod 700 /etc/letsencrypt/renewal-hooks/post/startCitrusServer.sh

