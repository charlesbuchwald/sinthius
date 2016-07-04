#!/bin/bash

_title "APPLICATION (start)"

mkdir -p "${DATA_PATH}/{bin,lib,src,tmp}"
mkdir -p "${DATA_PATH}/etc/{ca,secret}"
mkdir -p "${DATA_PATH}/var/{locale,log,object,otp,template}"
mkdir -p "${DATA_PATH}/var/public/static"


