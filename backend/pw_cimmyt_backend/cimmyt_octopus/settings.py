#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
# ~
# Author: Alejandro M. Bernardis
# Email: alejandro.bernardis@gmail.com
# Created: 13/jun/2016 13:15
# ~

# Nuc
NUC_NAME = 'NUC'
NUC_IP = '127.0.0.1'
NUC_PORT = 8040
NUC_MODE = 0
NUC_DESCRIPTION = 'Nuc description here...'

# Generic
DEBUG = False
if DEBUG is True:
    AUTORELOAD = True
DISABLE_BROWSER = True
SHUTDOWN_SECONDS = 0

# Server
PORT = NUC_PORT
APPLICATION = 'cimmyt_octopus.backend.base.SocketApplication'

PULL_TIME = 4000
PULL_RECONNECT_TIME = 2000
PULL_CHECK_TIMES = 4

HANDLERS = (
    'cimmyt_octopus.backend.observer',
    'cimmyt_octopus.backend.base',
)

DATABASES = {
    'default': {
        'name': 'cimmyt',
        'config': {
            'host': 'localhost',
            'port': 27017
        }
    }
}


KEYVALUES = {
    'default': {
        'name': 'cimmyt',
        'config': {
            'host': 'localhost',
            'port': 6379,
            'selected_db': 1
        }
    },
    'mission_control': {
        'name': 'mission_control',
        'config': {
            'host': 'localhost',
            'port': 6379,
            'selected_db': 0,
            'autoconnect': True
        }
    }
}

OBJECTS = {
    'default': {
        'name': 'cimmyt',
        'config': {
            'filename': 'cimmyt.file',
            'settings': {
                'root': '{object}',
                'makefile': True,
                'serializer': 'msgpack'
            }
        }
    }
}
