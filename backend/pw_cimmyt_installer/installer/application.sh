#!/bin/bash

source ./common.sh


#~
_title "APPLICATION (start)"

# Configure your app here...

mkdir -p /server/{bin,lib,src,tmp}
mkdir -p /server/etc/{ca,secret}
mkdir -p /server/var/{locale,log,object,otp,template}
mkdir -p /server/var/public/static

# ~
_title_break "C'est fini!~"