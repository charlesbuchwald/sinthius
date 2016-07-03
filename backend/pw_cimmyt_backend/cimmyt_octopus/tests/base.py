#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
# ~
# Author: Alejandro M. Bernardis
# Email: alejandro.bernardis@gmail.com
# Created: 13/Jun/2016 23:51
#

from __future__ import absolute_import, division, print_function, with_statement
import traceback
from bson import ObjectId
from cimmyt.utils.serializers import jsondumps
from cimmyt_octopus.backend.base import SocketApplication
from tornado import gen, ioloop, httpclient, httputil
from tornado.testing import AsyncHTTPTestCase

try:
    import tornado.websocket
    from tornado.util import _websocket_mask_python
except ImportError:
    traceback.print_exc()
    raise
from tornado.websocket import WebSocketClientConnection, websocket_connect


class WebSocketBaseTestCase(AsyncHTTPTestCase):
    _app = None

    @property
    def app(self):
        return WebSocketBaseTestCase._app

    def get_app(self):
        self.close_future = gen.Future()
        if WebSocketBaseTestCase._app is None:
            import os
            from cimmyt.constants import ENV_SETTINGS_MODULE
            os.environ.setdefault(ENV_SETTINGS_MODULE,
                                  'cimmyt_octopus.settings')
            from tornado import options
            from cimmyt.conf import global_options
            options.define('root_path', os.path.abspath(os.path.join(
                os.path.dirname(__file__), '../' * 3, 'server')))
            options.parse_command_line(final=False)
            from cimmyt.conf import settings
            if not settings.is_options_parsed():
                options.parse_command_line()
                settings.options_parse(options.options.as_dict())
            settings_dict = settings.as_dict()
            WebSocketBaseTestCase._app = SocketApplication(**settings_dict)
        return WebSocketBaseTestCase._app

    @gen.coroutine
    def ws_connect(self, path, ip='127.0.0.1', port=None,
                   compression_options=None):
        path = 'ws://%s:%d%s' % (ip, port or self.get_http_port(), path)
        ws = yield \
            websocket_connect(path, compression_options=compression_options)
        raise gen.Return(ws)

    @gen.coroutine
    def ws_connect_header(self, path, headers, ip='127.0.0.1', port=None,
                          compression_options=None):
        header = httputil.HTTPHeaders()
        for k, v in headers.iteritems():
            header.add(k, v)
        path = 'ws://%s:%d%s' % (ip, port or self.get_http_port(), path)
        request = httpclient.HTTPRequest(path)
        request.headers = header
        request = httpclient._RequestProxy(request, request.headers)
        conn = WebSocketClientConnection(
            ioloop.IOLoop.current(), request,
            compression_options=compression_options)
        ws = yield conn.connect_future
        raise gen.Return(ws)

    @gen.coroutine
    def close(self, ws):
        ws.close()

    def object_to_string(self, value):
        return jsondumps(value)

    def object_id(self):
        return ObjectId().__str__()

    _nuc_id = None

    def get_nuc(self, cache=False):
        if not cache:
            return self.object_id()
        if self._nuc_id is None:
            self._nuc_id = self.object_id()
        return self._nuc_id
