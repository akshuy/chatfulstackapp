from rest_framework import renderers
import json

class UserRenderer(renderers.JSONRenderer):
    charset='utf-8'
    def render(self, data, accepted_media_type=None, renderer_context=None):
        resposnse = ''
        if 'ErrorDetail' in str(data):
            resposnse = json.dumps({'errors':data})
        else:
            resposnse = json.dumps(data)

        return resposnse