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






