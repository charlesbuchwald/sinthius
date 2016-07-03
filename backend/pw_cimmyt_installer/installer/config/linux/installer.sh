#!/bin/bash

_title "LINUX"

LOCAL_NAME="linux"
LOCAL_CFG_PATH="${CFG_PATH}/${LOCAL_NAME}"

declare -a LOCAL_FILES=(
    "${LOCAL_CFG_PATH}/etc/security/limits.conf"
    "${LOCAL_CFG_PATH}/etc/sudoers"
    "${LOCAL_CFG_PATH}/etc/sysctl.conf"
    "${LOCAL_CFG_PATH}/root/dot_bash_profile"
)

_check_files ${LOCAL_NAME} LOCAL_FILES[@]

yum -y update \
    && yum -y upgrade \
    && yum -y groupinstall "Development tools" \
    && yum -y install nano wget tree gcc gcc-c++ compat-gcc-34-c++ \
        gcc-gfortran zlib zlib-devel bzip2 bzip2-devel openssl openssl-devel \
        ncurses ncurses-devel sqlite sqlite-devel gdbm gdbm-devel readline \
        readline-devel expat expat-devel freetype freetype-devel libjpeg \
        libjpeg-devel libpng libpng-devel gdb bison libtool make automake \
        strace autoconf gettext automake git vim lynx libevent libevent-devel \
        e2fsprogs-devel glibc-devel tk-devel glibc-devel libcurl libcurl-devel \
        nc libtool tk-devel gdbm-devel db4-devel libpcap-devel xz-devel man \
    && rpm -iUvh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm

iptables=/sbin/iptables

${iptables} -F
${iptables} -X
${iptables} -A INPUT -i lo -j ACCEPT
${iptables} -A OUTPUT -o lo -j ACCEPT
${iptables} -P INPUT DROP
${iptables} -P OUTPUT DROP
${iptables} -P FORWARD DROP
${iptables} -A INPUT -p icmp --icmp-type 8 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
${iptables} -A OUTPUT -p icmp --icmp-type 0 -m state --state ESTABLISHED,RELATED -j ACCEPT
${iptables} -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
${iptables} -A OUTPUT -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT

declare -a PORTS=(
    22 80 443 6379 
    4000 4001 4002 4003 4004 4005 4006 4007 4008 4009 
    8000 8001 8002 8003 8004 8005 8006 8007 8008 8009 
)

for port in "${PORTS[@]}"
do
    ${iptables} -A INPUT -p tcp --dport ${port} -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
    ${iptables} -A OUTPUT -p tcp --sport ${port} -m state --state ESTABLISHED,RELATED -j ACCEPT
done

service iptables save
${iptables} -L

localedef -i en_US -c -f UTF-8 en_US.UTF-8

rm -fR ${BACKUP_PATH} ${DOWNLOAD_PATH} ${DATA_PATH} ${DEPLOY_PATH}
mkdir -p ${BACKUP_PATH} ${DOWNLOAD_PATH} ${DATA_PATH} ${DEPLOY_PATH}

cp -bfv "${LOCAL_CFG_PATH}/root/dot_bash_profile" /root/.bash_profile
cp -bfv "${LOCAL_CFG_PATH}/etc/security/limits.conf" /etc/security/limits.conf
cp -bfv "${LOCAL_CFG_PATH}/etc/sysctl.conf" /etc/sysctl.conf
cp -bfv "${LOCAL_CFG_PATH}/etc/sudoers" /etc/sudoers

chmod 400 /etc/sudoers
source /root/.bash_profile

groupadd -r www
groupadd -r sysadmin
groupadd -r developer

useradd -M -r -g www \
        -d /var/lib/www \
        -s /bin/false \
        -c "Web" www > /dev/null 2>&1

create-administrator "sysadmin" "password"
create-developer "developer" "password"

echo "/usr/local/lib" >> /etc/ld.so.conf
echo "/usr/local/lib" > /etc/ld.so.conf.d/local-x86_64.conf
cat /etc/mtab > /etc/mtab-not-delete
cat /etc/fstab > /etc/fstab-not-delete
ulimit -a > /etc/ulimit-not-delete
