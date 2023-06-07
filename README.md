
# Workload Management Software

***

*Capstone 2022, Group 25*

## Important Rules to Note

1. If you are ever unsure of what something does, **do not** modify it until you have asked other group members.
2. If you modify something and you are unsure of the changes effect's or your changes cause the code to break, **do not** push your changes to the remote repositoy (i.e., this thing)
3. If you do push changes that cause the code to break or you are unsure of the changes effects, notify all other group members **immediately** and **do not** make any further changes.
4. **Do not** type `git add .` or `git commit -a` without checking which files have been modified. Not only could it be inconvenient having to remove files that you did not want to commit or push, but it could also be a security risk if you push secret configuration files to the repository.

The above rules generally only apply if you access the repository incorrectly. It is still good practice to follow them irrespective of how you are accessing the repository. To learn the correct process of interacting with the repository please see, [Contributing](#contributing).

## Development Practices

While developing the project, there is a specific order that should be followed. You don't have to adhere to these steps, however it will make your life easier if you do. 

The steps are as follows:

1. Build after changes to ensure no errors exist
2. Run in development mode while writing code so that changes are implemented without having to restart each server
3. Build Docker Images so that the application can be started as a container
3. Run Production Application
5. Deploy the docker application

For a more detailed guide on how to do this, please see [How To](#how-to).

# Repository Overview

***

## Software Component Structure

The repository has been broken down into three distinct components. These components are the frontend, backend and database. A brief description of the components are listed below, however for a more in-depth description on each component individually, there is a README in each directory.

- WorkloadManager

    The backend files have been stored in a directory labelled 'WorkloadManager'. The project files were generated using Visual Studio and as such it is a standard ASP.NET Core Web API application.

- Frontend

    The frontend directory contains all files pertaining to the applications interface. It was generated as a standard `create-react-app` application. In this directory, is all the project files, but also a standard development server that allows for features such as 'hot-reload'.

- Database

    The database directory contains SQL files that are needed to get the SQL instance up and running. However, to run this software locally you are still required to install a MySQL server instance separately.

## Configuration Files

For each components configuration, please see their respective README files. However, some more general configuration files are stored in the base directory.

- docker-compose.yml

    This file used to run all three docker containers in unison. This has already been configured and will probably not need to change much, if at all. As such it should be left alone until we are sure changes need to be made to it.

- .env

    This is a configuration file that contains database configuration information. It is used by `docker-compose` to configure the databases environment variables such as username, password, port, etc. **This file should NEVER be pushed to the repository**. `.gitignore` contains a rule to ignore `.env` files, but still be cautious. There is a template .env file called `template_env_file`. Simply change the values and rename the file. 

- .gitignore

    A standard `.gitignore` file. Feel free to add any files that you find should not be pushed to the repository. Don't remove anything from here unless you have consulted all other group members first. This is important as if other group members do not notice that a rule has been removed from the `.gitignore` file, they may unintentionally push something to the repository. 

# How To

***

## Build

There are three components in the application howevever only two need to be built: the frontend and backend.

- Frontend

    Since the frontend is written in JavaScript, any syntactical errors will be picked up by the development server. This means that if you are already running the development server you will not need to perform this action to check for errors. **However**, we still need to build the JavaScript project, because pure React is served as static files to the client. This file serving will be performed by Nginx, as the development server is not suitable for this purpose. Additionally, if you are writing code without running the development server, it is useful to perform this step for error checking purposes.

    To build the frontend, the first step is to open a terminal or command prompt window and navigate to the frontend directory. Once in the directory, simply type:

        npm run build

- Backend

    ASP.NET Core, like React, has a development server with hot changes enabled. This means that running the development server will pick up *most* errors. Unlike React, the ASP.NET Core development server is less flexible in what you can and can't change using hot changes since C# is a compiled language. 

    To build the backend open a terminal or command prompt window, navigate to the WorkloadManager directory and type:

        dotnet build

## Run

Running each component in the development environment will require you to start each component manually (i.e., the backend, frontend and database). How you start the database will depend on your own computer, but on most instances it is running constantly in the background so that will not be covered here.

- Frontend

    Navigate to the frontend directory in terminal or command prompt. Run the following command:

        npm start

    This will automatically open a browser window with the homepage loaded up.

- Backend

    Navigate to the WorkloadManager directory in terminal or command prompt. Run the following command:

        dotnet run

    On your screen you should see localhost ports being exposed. In your browser, navigate to http://localhost:7001/swagger/index.html. The page that opens will only be available in the development environment. It is made for testing API calls and is very useful.

## Build Docker Images

Building docker images is required before you can run the application in production mode. 

- Frontend

    Navigate to the frontend directory in terminal or command prompt. Run the following command:

        docker build --tag frontend .

- Backend

    Navigate to the WorkloadManager directory in terminal or command prompt. Run the following command:

        docker build --tag backend .

- Database

    Navigate to the database directory in terminal or command prompt. Run the following command:

        docker build --tag database .


## Run Production Application

After ensuring your local git repository has all the latest updates from the remote repository and you have built all docker images you will be ready to run the application as it would be in a production environment.

Navigate to the project root directory in terminal or command prompt. Run the following command:

    docker-compose up -d

This will start all containers simultaneously as well as create a volume, if one does not already exist, to ensure that data in the database will persist.

To stop the application, run the following command:

    docker-compose down

## Deploy Docker Containers

To be announced...

# Contributing

***

To be announced...
