from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.urls import Resolver404
from .forms import UserRegistrationForm
from django.contrib.auth.models import Group
from django.contrib.auth.views import LoginView

# Create your views here.
"""
def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            usuario = authenticate(request, username=cd['username'], password=cd['password'])
            if usuario is not None:
                if usuario.is_active:
                    login(request, usuario)
                    return HttpResponse("Usuario autenticado")
                else:
                    return HttpResponse("Usuario inactivo")
            else:
                return HttpResponse("Usuario no existe")
    else:
        form = LoginForm()
    return render(request, 'account/login.html', {
        'form': form
    })
"""
"""
@login_required
def dashboard(request):
    return render(request, 'account/dashboard.html', {
        'section': 'dashboard'
    })
"""


def es_cliente(user):
    return user.groups.filter(name='Client').exists()

def es_cocinero(user):
    return user.groups.filter(name='Cook').exists()

def es_adminapp(user):
    return user.groups.filter(name='AppAdmin').exists()


@login_required
def dashboard(request):
    user = request.user
    if es_cliente(user):
        return redirect('vista_cliente')
    elif es_cocinero(user):
        return redirect('vista_cocinero')
    else:
        return redirect('vista_admin')


def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            nuevo_usuario = form.save(commit=False)  
            nuevo_usuario.set_password(form.cleaned_data['password'])
            nuevo_usuario.save()
            client_group = Group.objects.get(name='Client')
            nuevo_usuario.groups.add(client_group)
            return render(request, 'account/register_done.html', {
                'new_user': nuevo_usuario
            })
    else:
        form = UserRegistrationForm()
    return render(request, 'account/register.html', {'form': form})


@login_required
@user_passes_test(es_cliente)
def vista_cliente(request):
    return render(request, 'account/vista_cliente.html')


@login_required
@user_passes_test(es_cocinero)
def vista_cocinero(request):
    return render(request, 'account/vista_cocinero.html')


@login_required
@user_passes_test(es_adminapp)
def vista_admin(request):
    return render(request, 'account/vista_admin.html')


class RolBasedLoginView(LoginView):
    def get_success_url(self):
        user = self.request.user
        next_url = self.get_redirect_url() 

        if next_url:
            from django.urls import resolve
            try:
                url_name = resolve(next_url).url_name
                if url_name == 'vista_cliente' and es_cliente(user):
                    return next_url
                elif url_name == 'vista_cocinero' and es_cocinero(user):
                    return next_url
                elif url_name == 'vista_admin' and es_adminapp(user):
                    return next_url
            except Resolver404:
                pass
            
        if es_cliente(user):
            return '/account/vista/cliente/'
        elif es_cocinero(user):
            return '/account/vista/cocinero/'
        else:
            return '/account/vista/admin/'