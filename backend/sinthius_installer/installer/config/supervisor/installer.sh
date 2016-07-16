#!/bin/bash

_title "SUPERVISOR"

LOCAL_NAME="supervisor"
LOCAL_CFG_PATH="${CFG_PATH}/${LOCAL_NAME}"

declare -a LOCAL_FILES=(
    "${LOCAL_CFG_PATH}/server/etc/supervisord/backend.conf"
    "${LOCAL_CFG_PATH}/server/etc/supervisord/backoffice.conf"
    "${LOCAL_CFG_PATH}/etc/rc.d/init.d/supervisord"
    "${LOCAL_CFG_PATH}/etc/supervisord.conf"
)

_check_files ${LOCAL_NAME} LOCAL_FILES[@]

groupadd -r supervisord

useradd -M -r -g supervisord \
        -G www \
        -d /var/lib/supervisord \
        -s /bin/false \
        -c "Supervisor" supervisord > /dev/null 2>&1

mkdir -p "${DATA_PATH}/etc/supervisord" \
         "${DATA_PATH}/var/log/supervisord" \
         "${DATA_PATH}/var/run/supervisord"

cp -bfv "${LOCAL_CFG_PATH}/server/etc/supervisord/backend.conf" "${DATA_PATH}/etc/supervisord/backend.conf"
cp -bfv "${LOCAL_CFG_PATH}/server/etc/supervisord/backoffice.conf" "${DATA_PATH}/etc/supervisord/backoffice.conf"
cp -bfv "${LOCAL_CFG_PATH}/etc/rc.d/init.d/supervisord" /etc/rc.d/init.d/supervisord
cp -bfv "${LOCAL_CFG_PATH}/etc/supervisord.conf" /etc/supervisord.conf

chown -R supervisord:supervisord "${DATA_PATH}/etc/supervisord" \
                                 "${DATA_PATH}/var/log/supervisord" \
                                 "${DATA_PATH}/var/run/supervisord"

chmod a+x /etc/rc.d/init.d/supervisord
chkconfig --add supervisord
chkconfig supervisord on
