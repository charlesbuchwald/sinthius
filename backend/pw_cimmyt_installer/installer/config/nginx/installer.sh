#!/bin/bash

# -- Read: 
# http://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html

_title "NGINX"

LOCAL_NAME="nginx"
LOCAL_CFG_PATH="${CFG_PATH}/${LOCAL_NAME}"

declare -a LOCAL_FILES=(
    "${LOCAL_CFG_PATH}/server/etc/nginx/errors.conf"
    "${LOCAL_CFG_PATH}/server/etc/nginx/sites-available/backend.vhost"
    "${LOCAL_CFG_PATH}/server/etc/nginx/sites-available/backoffice.vhost"
    "${LOCAL_CFG_PATH}/server/etc/nginx/sites-available/public.vhost"
    "${LOCAL_CFG_PATH}/server/ssl/server.crt"
    "${LOCAL_CFG_PATH}/server/ssl/server.key"
    "${LOCAL_CFG_PATH}/etc/nginx/nginx.conf"
    "${LOCAL_CFG_PATH}/etc/yum.repos.d/nginx.repo"
)

_check_files ${LOCAL_NAME} LOCAL_FILES[@]

cp -bfv "${LOCAL_CFG_PATH}/etc/yum.repos.d/nginx.repo" /etc/yum.repos.d/nginx.repo
yum -y install nginx 
chkconfig nginx on

mkdir -p /server/etc/nginx/sites-available \
         /server/etc/nginx/sites-enabled \
         /server/ssl

cp -bfv "${LOCAL_CFG_PATH}/server/etc/nginx/errors.conf" /server/etc/nginx/errors.conf
cp -bfv "${LOCAL_CFG_PATH}/server/etc/nginx/sites-available/backend.vhost" /server/etc/nginx/sites-available/backend.vhost
cp -bfv "${LOCAL_CFG_PATH}/server/etc/nginx/sites-available/backoffice.vhost" /server/etc/nginx/sites-available/backoffice.vhost
cp -bfv "${LOCAL_CFG_PATH}/server/etc/nginx/sites-available/public.vhost" /server/etc/nginx/sites-available/public.vhost
cp -bfv "${LOCAL_CFG_PATH}/server/ssl/server.crt" /server/ssl/server.crt
cp -bfv "${LOCAL_CFG_PATH}/server/ssl/server.key" /server/ssl/server.key
cp -bfv ${LOCAL_CFG_PATH}/etc/nginx/nginx.conf /etc/nginx/nginx.conf

cd /server/etc/nginx/sites-enabled
# ln -sf ../sites-available/backend.vhost .
ln -sf ../sites-available/backoffice.vhost .
ln -sf ../sites-available/public.vhost .

echo "127.0.0.1    backend.local" >> /etc/hosts