from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Note


# Create your views here.
# generics: generate classic methods (create, update, delete, list)
class CreateUserView(generics.CreateAPIView):
    # List all users to prevent creating a user already created
    queryset = User.objects.all()
    # What kind of data needed to accept to create new user
    serializer_class = UserSerializer
    # Who can call this method
    permission_classes = [AllowAny]


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user 
        return Note.objects.filter(author=user)
    
    # Overwrite the create behavior of generics
    def perform_create(self, serializer):
        if serializer.is_valid():
            # Since author is read only, it has to be 
            # set manually
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)
            

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user 
        return Note.objects.filter(author=user)