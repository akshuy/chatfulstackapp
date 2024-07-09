from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.serializers import Registerserializer,Userloginserilizer,UserProfileserilizer,changepasswordUserserilizer,sendpasswordserilizer,userpasswordresetserializer
from account.models import MyUser
from django.contrib.auth import authenticate
from account.renderes import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
# generate token manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
class Userregister(APIView):
    renderer_classes = [UserRenderer]
    def post(self,request,format=None):
        serializer =  Registerserializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({"token":token,"message":"Registrations successfully create"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class Uselogin(APIView):
    renderer_classes = [UserRenderer]
    def post(self,request,format=None):
        serializer = Userloginserilizer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            user = authenticate(email=email,password=password)
            if user is not None:
                token = get_tokens_for_user(user)
                return Response({"token":token,"message":"Login successfully "},status=status.HTTP_200_OK)
            else:
                return Response({'errors':{'non_field_errors':['Email or password is not valid']}},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class profileview(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,format=None):
        serializer = UserProfileserilizer(request.user)
        return Response(serializer.data,status=status.HTTP_200_OK)


class changepassword(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request,format=None):
        serializer = changepasswordUserserilizer(data=request.data,context = {'user':request.user})
        if serializer.is_valid(raise_exception=True):
            return Response({"massage":"passwordchange successfully"},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class sendpasswordchange(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = sendpasswordserilizer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)

class userpasswordreset(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request,uid,token, format=None):
        serializer = userpasswordresetserializer(data=request.data,context = {'uid':uid,'token':token})
        serializer.is_valid(raise_exception=True)
        return Response({'msg':'Password Reset successfully'}, status=status.HTTP_200_OK)   