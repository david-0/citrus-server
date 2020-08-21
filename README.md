# TypeOrm Schema Migration
npm run typeorm:cli -- migration:generate -n QuantityMigration

# citrus-server
Citrus-Server

## Postgre access
sudo -u postgres -i
psql citrus


## pm2 installation
###
npm install -g pm2
pm2 install pm2-logrotate




# configure environment
## postgre sql configuration
apt update
apt install postgresql
```
sudo -u postgres -i
createuser -P citrus
createdb -O citrus citrus
\q
```

### insert initial admin user
Start server to create the databasetables.

and register user with the frontend
```
sudo -u postgres -i
psql citrus
insert into role (id,name) values ('1','admin');
insert into role (id,name) values ('2','sale');
insert into role (id,name) values ('3','guest');
insert into role (id,name) values ('4','store');
insert into user_roles_role ("userId", "roleId") values ('1', '1');
```

## install nodejs
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs

### Allow Node to bind to port 80 without sudo
(https://gist.github.com/firstdoit/6389682)
sudo setcap 'cap_net_bind_service=+ep' /usr/bin/node


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

