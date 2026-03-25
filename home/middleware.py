
# home/middleware.py
from django.shortcuts import redirect
from django.utils.deprecation import MiddlewareMixin

class PreventBackMiddleware(MiddlewareMixin):
    def process_view(self, request, view_func, view_args, view_kwargs):
        # Allow unauthenticated access to these paths
        allowed_paths = ['/about','/login/', '/singup', '/favicon.ico','/', '/forgot_password/', '/verify_otp/', '/reset-password/', '/password-reset/done/', '/password-reset/', '/reset/done/','/forgot_email/','/contact', '/check-username/','/send_message/','/landing/']

        # Block unauthenticated users from protected routes
        if not request.user.is_authenticated:
            if request.path not in allowed_paths and not request.path.startswith('/static/'):
                return redirect('login')

    def process_response(self, request, response):
        # Set no-cache headers globally
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        return response
