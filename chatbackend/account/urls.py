from django.contrib import admin
from django.urls import path,include
from account.views import Userregister,Uselogin,profileview,changepassword,sendpasswordchange,userpasswordreset
urlpatterns = [
    path('register/', Userregister.as_view(), name='register'),
    path('login/',Uselogin.as_view(), name='login'),
    path('userprofile/',profileview.as_view(), name='profile'),
    path('changepassword/',changepassword.as_view(), name='changepassword'),
    path('sendpasswordlink/',sendpasswordchange.as_view(), name='sendpasswordlink'),
    path('resetpassword/<uid>/<token>/',userpasswordreset.as_view(), name='resetpassword'),

]
