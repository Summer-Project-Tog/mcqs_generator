# mcqs_generator

- Create requirements.txt

    >pip freeze > requirements.txt

- To run requirements.txt

    >pip install -r requirements.txt

- Create a Python virtual environment, if not already created.

    >python -m venv env

- if Execution Error during starting of env

    >Set-ExecutionPolicy Unrestricted -Scope Process

- Start the Python virtual environment.

    For Windows Git Bash:
    >source ./env/Scripts/activate

    For Windows Powershell:
    >./env/Scripts/activate

    For Linux:
    >source ./env/bin/activate

After creating env, do the following

1) Download latest version of CUDA and CUDNN (V12.4 && V9.1 respectively)

- Download CUDA for windows 10

    https://developer.nvidia.com/cuda-downloads?target_os=Windows&target_arch=x86_64&target_version=11&target_type=exe_local
    Windows -> x86_64 -> 10 -> exe(local)

- Download CUDNN for windows 10

    https://developer.nvidia.com/cudnn-downloads?target_os=Windows&target_arch=x86_64&target_version=10&target_type=exe_local
    Windows -> x86_64 -> 10 -> exe(local)

2) uninstall current version of Pytorch 
    >pip uninstall torch

3) Reinstall on console command from pytorch website

    go to [website](https://pytorch.org/get-started/locally/) and check, currently: 
    >pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

    referenced from [here](https://stackoverflow.com/questions/57814535/assertionerror-torch-not-compiled-with-cuda-enabled-in-spite-upgrading-to-cud)

4) Test out on using python
    >python test.py

If successful will return CUDA attached GPU
