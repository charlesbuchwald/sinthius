#!/bin/bash

# Utils
source ./common.sh
_title "INSTALLER (start)"

# Paths
ROOT_PATH=`pwd`
CFG_PATH="${ROOT_PATH}/config"
DATA_PATH="/server"
DEPLOY_PATH="/deploy"
BACKUP_PATH="/root/backups"
DOWNLOAD_PATH="/root/downloads"

# Installers
_title_break "Install configuration..."

declare -a INSTALLERS=(
    "${CFG_PATH}/linux/installer.sh"
    "${CFG_PATH}/python/installer.sh"
    "${CFG_PATH}/supervisor/installer.sh"
    "${CFG_PATH}/redis/installer.sh"
    "${CFG_PATH}/nginx/installer.sh"
)

for installer in "${INSTALLERS[@]}"
do
    if [ ! -e ${installer} ]; 
    then
        echo "(e): File not found: ${installer}"
        exit 3
    else
        source ${installer}
    fi
done

# Verifications
_title_break "Verify configuration..."

echo -n '* Python....... '
[ ! -e /usr/local/bin/python2.7   ] && echo 'error' || echo 'ok'
echo -n '* Supervisor... '
[ ! -e /usr/local/bin/supervisord ] && echo 'error' || echo 'ok'
echo -n '* Redis........ '
[ ! -e /usr/local/bin/redisd      ] && echo 'error' || echo 'ok'
echo -n '* Nginx........ '
[ ! -e /usr/sbin/nginx            ] && echo 'error' || echo 'ok'
echo ""

# Install application server
source "${CFG_PATH}/application.sh"

# ~
_title_break "C'est fini!~"
