from django.contrib import admin
from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from .views import reset_password
from .views import get_pronunciation_audio
from quantum_research.views import quantum_news, article_detail





urlpatterns = [
    
    path('', views.landing_page, name ='landing'),
    
    path('home', views.user_dashboard, name='home'),
    
    path('pronounce/<path:word>/', get_pronunciation_audio, name='pronounce-audio'),
    
    path('singup', views.SignupPage, name='signup'),
    path('login/', views.LoginPage, name='login'),
    path('simulator/', views.HomePage, name='simulator'),
    path('logout/', views.LogoutPage, name='logout'),
    path('forgot_email/', views.ForgotEmailView, name='forgot_email'),
    path('forgot_password/', views.ForgotPasswordView, name='forgot_password'),
   
    path('forgot_email/', views.ForgotEmailView, name='forgot_email'),

    # Forgot Password (step 1: enter email → sends OTP)
    path('forgot_password/', views.ForgotPasswordView, name='forgot_password'),

    # Verify OTP (step 2: enter OTP)
    path('verify_otp/', views.verify_otp, name='verify_otp'),

    # Reset Password (step 3: set new password)
    path('reset-password/', views.reset_password, name='reset_password'),

    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    
    path("news/", quantum_news, name="quantum_news"),
    path("simulator",views.simulator,name='simulator'),
    path("about",views.about,name='about'),
    path("contact",views.contact,name='contact'),

    path('send_message/', views.send_message, name="send_message"),
    path('profile/', views.profile_view, name='profile'),
 
    path('check-username/', views.check_username, name='check_username'),

    path('article/<str:id>/', article_detail, name='article-detail')

]   
