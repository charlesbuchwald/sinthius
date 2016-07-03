#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
# ~
# Author: Alejandro M. Bernardis
# Email: alejandro.bernardis@gmail.com
# Created: 15/Jun/2016 23:03
#

import sys
import click

cli = click.Group()


def main(as_module=False):
    this_module = __package__ + '.cli'
    args = sys.argv[1:]
    if as_module:
        if sys.version_info >= (2, 7):
            name = 'python -m ' + this_module.rsplit('.', 1)[0]
        else:
            name = 'python -m ' + this_module
        sys.argv = ['-m', this_module] + sys.argv[1:]
    else:
        name = None
    cli.main(args=args, prog_name=name)


if __name__ == '__main__':
    main(as_module=True)
