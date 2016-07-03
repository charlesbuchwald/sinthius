#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
# ~
# Author: Alejandro M. Bernardis
# Email: alejandro.bernardis@gmail.com
# Created: 26/Jun/2016 20:07
#

from cimmyt_octopus.backend.base import WebSocketApiHandler, WebSocketHandler, \
    rx_node


class GetHandler(WebSocketApiHandler):
    def get(self, *args, **kwargs):
        try:
            node = self.get_argument('node')
            if not rx_node.search(node):
                raise TypeError, 'Node "%s" not supported.' % node
            self.success(self.application.nodes[node])
        except Exception, e:
            self.error(e.__str__())


class NodeHandler(WebSocketApiHandler):
    def get(self, *args, **kwargs):
        self.success({
            'node': self.application.node_id,
            'info': self.application.node_info
        })


class NodesHandler(WebSocketApiHandler):
    def get(self, *args, **kwargs):
        fallen_nodes = list(self.application.fallen_nodes)
        self.success({
            'registered': {
                'list': self.application.nodes,
                'total': len(self.application.nodes)
            },
            'fallen': {
                'list': fallen_nodes,
                'total': len(fallen_nodes)
            }
        })


class ObserverHandler(WebSocketHandler):
    def open(self, *args, **kwargs):
        self.application.clients.add(self)

    def on_close(self):
        self.application.clients.remove(self)


handlers_list = [
    (r'/api/get/?', GetHandler),
    (r'/api/node/?', NodeHandler),
    (r'/api/nodes/?', NodesHandler),
    (r'/ws/observer/?', ObserverHandler),
]
