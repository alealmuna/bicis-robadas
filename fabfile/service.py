from fabric.api import sudo
from fabric.contrib.files import upload_template

def handler(service, action):
    """ Handler method for service operations. """
    cmd = 'service %s %s' % (service, action)
    return sudo(cmd)


def nginx_handler(action):
    """ Helper method for nginx service operations. """
    return handler('nginx', action)


def gunicorn_handler(action):
    """ Helper method for gunicorn instance service operations. """
    return handler('django', action)


def add_upstart_task(filename, context):
    """ Deploys an upstart configuration task file. """
    destination = '/etc/init' 
    upload_template(filename, destination, context=context, use_sudo=True)
