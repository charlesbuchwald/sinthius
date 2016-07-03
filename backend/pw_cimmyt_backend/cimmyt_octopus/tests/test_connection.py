#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
# ~
# Author: Alejandro M. Bernardis
# Email: alejandro.bernardis@gmail.com
# Created: 13/Jun/2016 23:54
#

from cimmyt_octopus.tests.base import WebSocketBaseTestCase
from tornado.testing import gen_test


class TestConnection(WebSocketBaseTestCase):
    def get_nuc_url(self, cache=False):
        return '/ws/observer/' + self.get_nuc(cache)

    @gen_test
    def test_01(self):
        ws = yield self.ws_connect(self.get_nuc_url())
        resp = yield ws.read_message()
        self.assertEqual(resp, 'true')
        ws.close()
