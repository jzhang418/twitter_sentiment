from django.urls import path
from . import views

urlpatterns = [
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    path('users/register/', views.registerUser, name="register"),
    path('users/profile/', views.getUserProfile, name="users-profile"),
    path('users/profile/update/', views.updateUserProfile, name="users-profile-update"),

    path('accounts/', views.getAccounts, name="accounts"),
    path('accounts/checkbot/<str:name>/', views.checkBot, name="accounts-checkbot"),

    path('tweets/', views.getTweets, name="tweets"),
]