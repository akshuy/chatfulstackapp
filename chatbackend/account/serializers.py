from rest_framework import serializers
from account.models import MyUser
from django.utils.encoding import smart_str,force_bytes,DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from account.utils import Util
class Registerserializer(serializers.ModelSerializer):
    password2= serializers.CharField(style={'input_type':'password'},write_only=True)
    class Meta:
        model = MyUser
        fields = ["email","name","password","password2","tc"]
        extra_kwargs={
            'password':{'write_only':True}
        }

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError('Password does not match')
        return attrs
    
    def create(self, validated_data):
        return MyUser.objects.create_user(**validated_data)
    
class Userloginserilizer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length = 255)
    class Meta:
        model = MyUser
        fields = ["email","password"]
        
class UserProfileserilizer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ["id","name","email","password"]

class changepasswordUserserilizer(serializers.Serializer):
    password = serializers.CharField(max_length = 255,style={'input_type':'password'},write_only=True)
    password2 = serializers.CharField(max_length = 255,style={'input_type':'password'},write_only=True)
    class Meta:
        model = MyUser
        fields = ["password","password2"]

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')
        if password != password2:
            raise serializers.ValidationError('Password does not match')
        user.set_password(password)
        user.save()
        return attrs
    

class sendpasswordserilizer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = MyUser
        fields = ["email"]  
    def validate(self, attrs):
        email = attrs.get('email')
        if MyUser.objects.filter(email = email).exists():
            user = MyUser.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            print(uid,token)
            link = 'http://localhost:3000/api/user/reset/'+uid+'/'+token
            print(link)
            body = 'Click the link to reset your password '+ link
            data = {
                "subject":"Reset your password",
                "body":body,
                "to_email":user.email
            }
            Util.send_email(data)
            return attrs
        else:
            raise ValueError('You are not register user')
    
class userpasswordresetserializer(serializers.Serializer):
    password = serializers.CharField(max_length = 255,style={'input_type':'password'},write_only=True)
    password2 = serializers.CharField(max_length = 255,style={'input_type':'password'},write_only=True)
    class Meta:
        model = MyUser
        fields = ["password","password2"]

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')
            if password != password2:
                raise serializers.ValidationError('Password does not match')
            id = smart_str(urlsafe_base64_decode(uid))
            user = MyUser.objects.get(id = id)
            if not PasswordResetTokenGenerator().check_token(user,token):
                raise ValueError("Token is not valid or expired")
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError as identifire:
            PasswordResetTokenGenerator().check_token(user,token)
            raise ValueError("Token is not valid or expired")