# Overview

CodeArena is a code playground where you can add and solve questions in C++, JS and Python. It uses redis as a continous background worker to run and execute code using node child processes

## Project Structure
- Backend
- Frontend
- Worker

## Database 
- Code Arena uses postgres with user, question and submission model 

## Frontend
- Code Arena uses react along with react-router-dom, react-redux, react-hot-toast and axios for frontend for making connections with the backend

## Backend
- Code Arena's backend is made using Nodejs, Express and Postgres along with Redis using it's queue functionality for pushing and popping the items

