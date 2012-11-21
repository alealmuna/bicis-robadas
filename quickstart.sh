#!/bin/bash

INSTALL_APTITUDE=true
INSTALL_PIP=true
INSTALL_HEROKU=false
while getopts “ahp” OPTION
do
    case $OPTION in
        a)
             echo "only install aptitude"
             INSTALL_APTITUDE=true
             INSTALL_PIP=false
             INSTALL_HEROKU=false
             ;;
        p)
             echo "only pip install"
             INSTALL_APTITUDE=false
             INSTALL_PIP=true
             INSTALL_HEROKU=false
             ;;
        h)
             echo "only heroku install"
             INSTALL_APTITUDE=false
             INSTALL_PIP=false
             INSTALL_HEROKU=true
             ;;
        ?)
             echo "fail"
             exit
             ;;
     esac
done

if  $INSTALL_APTITUDE ; then
    # sudo install virtual env and other things with aptitude

    # Install base packages
    yes | sudo apt-get install python-pip python-virtualenv python-dev 

    echo "Are you going to use mysql for your database? [N/y]"
    read INSTALL_MYSQL

    if [[ "$INSTALL_MYSQL" == "y" ]]
    then
        # Install mysql related packages
        yes | sudo apt-get install libmysqlclient-dev python-mysqldb
    else
        echo "Are you going to use postgres for your database? [N/y]"
        read INSTALL_POSTGRES

        if [[ "$INSTALL_POSTGRES" == "y" ]]
        then
            ./install/postgres.sh
        else
            INSTALL_POSTGRES="n"
        fi
    fi

    echo "Do you want to install geodjango requirements? [Y/n]"
    read INSTALL_GEODJANGO_REQ
    if [[ $INSTALL_GEODJANGO_REQ == 'Y' || $INSTALL_GEODJANGO_REQ == 'y' ]]
    then
        export INSTALL_POSTGRES
        ./install/geodjango_requirements.sh
    fi

    # set a new virtual environment
    virtualenv .env --distribute
fi
if  $INSTALL_PIP ; then
    # activate the environment
    source .env/bin/activate

    # update easy_install (used by pip)
    easy_install -U distribute

    # install pip requiredments in the virtual environment
    .env/bin/pip install --requirement install/requirements.pip

fi

# update pip database requirements
source .env/bin/activate
if [[ "$INSTALL_MYSQL" == "y" ]]
then
    pip install MySQL-python
elif [[ "$INSTALL_POSTGRES" == "y" ]]
then
    pip install psycopg2
fi

# HEROKU 
if  $INSTALL_HEROKU ; then
    # activate the environment
    source .env/bin/activate

    wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh
    heroku login
    pip install Django psycopg2 dj-database-url
    pip freeze > requirements.txt

    echo "Would you like to create a new heroku repo? [N/y]"
    read CREATE_REPO

    if [[ "$CREATE_REPO" == "y" ]]
    then
        heroku create
        echo "You should now commit the requirements.txt file."
        echo "Then deploy to heroku: git push heroku master"
    fi
fi

# create the local_settings file if it does not exist
if [ ! -f ./config/local_settings.py ] ; then
    cp config/local_settings.py.default config/local_settings.py
    EXP="s/django-db/${PWD##*/}/g"
    echo $i|sed -i $EXP config/local_settings.py
fi
