#!/bin/bash

function _title() {
    echo ""
    echo "~"
    echo "** ${1} **"
}

function _title_break() {
    echo ""
    echo "~"
    echo "* ${1}"
}

function _check_files() {
    declare -a files=("${!2}")
    for file in "${files[@]}"
    do
        if [ ! -e ${file} ];
        then
            echo "(e): ~${1}~ File not found: ${file}"
            exit 3
        fi
    done
}

