#!/bin/bash

_title "ERLANG"

cd ${DOWNLOAD_PATH}
curl -O http://packages.erlang-solutions.com/site/esl/esl-erlang/FLAVOUR_1_general/esl-erlang_19.0~centos~7_amd64.rpm
rpm -Uvh esl-erlang_19.0~centos~7_amd64.rpm
yum -y install erlang

_title "MQTT"

groupadd -r mqtt

useradd -M -r -g mqtt \
        -G www \
        -d /var/lib/mqtt\
        -s /bin/false \
        -c "MQTT" mqtt > /dev/null 2>&1

mkdir -p "${DATA_PATH}/etc/mqtt" \
         "${DATA_PATH}/var/log/mqtt" \
         "${DATA_PATH}/var/run/mqtt"

cd ${DOWNLOAD_PATH}
git clone https://github.com/emqtt/emqttd.git

cd emqttd
git submodule add https://github.com/emqtt/emqttd_stomp.git plugins/emqttd_stomp

cp -fR "${DOWNLOAD_PATH}/emqttd/*" "${DATA_PATH}/etc/mqtt/"
