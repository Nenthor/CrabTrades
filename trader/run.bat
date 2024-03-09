@echo off
setlocal

:: don't forget set PATH=%PATH%;%APPDATA%\Python\Scripts to env variables

set "notebook_file=notebook.ipynb"
set "python_script=main"

:: Check if the Python script already exists
if not exist "%python_script%" (
    :: Convert the Jupyter Notebook to a Python script
    jupyter nbconvert --to script --output "%python_script%" "%notebook_file%"
)

:: Run the Python script
py "%python_script%".py