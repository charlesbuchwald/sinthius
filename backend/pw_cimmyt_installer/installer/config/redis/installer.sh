#!/bin/bash

_title "REDIS"

LOCAL_NAME="redis"
LOCAL_CFG_PATH="${CFG_PATH}/${LOCAL_NAME}"

declare -a LOCAL_FILES=(
    "${LOCAL_CFG_PATH}/etc/rc.d/init.d/redisd"
    "${LOCAL_CFG_PATH}/etc/redisd.conf"
)

_check_files ${LOCAL_NAME} LOCAL_FILES[@]

cd ${DOWNLOAD_PATH}
curl -O http://download.redis.io/releases/redis-3.2.1.tar.gz
tar xfvz redis-3.2.1.tar.gz

cd redis-3.2.1
make
make test
make install

groupadd -r redis

useradd -M -r -g redis \
        -G www \
        -d /var/lib/redis \
        -s /bin/false \
        -c "Redis" redis > /dev/null 2>&1

mkdir -p "${DATA_PATH}/etc/redis" \
         "${DATA_PATH}/var/log/redis" \
         "${DATA_PATH}/var/run/redis" \
         "${DATA_PATH}/data/redis"

cp -bfv "${LOCAL_CFG_PATH}/etc/rc.d/init.d/redisd" /etc/rc.d/init.d/redisd
cp -bfv "${LOCAL_CFG_PATH}/etc/redisd.conf" /etc/redisd.conf

chmod a+x /etc/rc.d/init.d/redisd
chkconfig --add redisd
chkconfig redisd on
