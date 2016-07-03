#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
# ~
# Author: Alejandro M. Bernardis
# Email: alejandro.bernardis@gmail.com
# Created: 10/Jun/2016 22:20
# ~

from cimmyt.constants import ENCODING


class BaseError(Exception):
    _code = -1

    def __init__(self, message, code=None, exception=None, *args, **kwargs):
        if message is None and exception is not None:
            message = str(exception)
        super(BaseError, self).__init__(message, *args, **kwargs)
        try:
            self.code = int(code)
        except:
            self.code = self._code
        self._exception = exception
        self._errors = kwargs.get('errors', [])

    @property
    def exception(self):
        return self._exception

    @property
    def errors(self):
        return self._errors

    def __unicode__(self):
        return unicode(self.message)

    def __str__(self):
        return self.__unicode__().encode(ENCODING)

    def __nonzero__(self):
        return False


# 1000 - 999999

class ConfigurationError(BaseError):
    _code = 0
class FileError(BaseError):
    _code = 0
class FolderError(BaseError):
    _code = 0
class SecurityError(BaseError):
    _code = 0
class CryptoError(BaseError):
    _code = 0
class PasswordError(BaseError):
    _code = 0
class OTPError(BaseError):
    _code = 0
class SecretsError(BaseError):
    _code = 0
class BadSignature(BaseError):
    _code = 0
class SignatureExpired(BaseError):
    _code = 0
class ContextError(BaseError):
    _code = 0
class BarrierError(BaseError):
    _code = 0
class CounterError(BaseError):
    _code = 0
class PolicyError(BaseError):
    _code = 0
class ManagerError(BaseError):
    _code = 0
class FactoryError(BaseError):
    _code = 0
class MessageError(BaseError):
    _code = 0
class ApiRequestError(BaseError):
    _code = 0
class ApiResponseError(BaseError):
    _code = 0
class SessionError(BaseError):
    _code = 0
class FormError(BaseError):
    _code = 0
class SchemaError(BaseError):
    _code = 0
class ModelError(BaseError):
    _code = 0
class DocumentError(BaseError):
    _code = 0
class ClientError(BaseError):
    _code = 0
class EmailError(BaseError):
    _code = 0
class SMSError(BaseError):
    _code = 0
