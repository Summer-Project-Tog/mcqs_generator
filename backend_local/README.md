# Getting Started with Python Flask Backend

## First Time Running

When you have not installed anything, follow these steps

1. Make sure you are in the backend_local directory

### `cd backend_local/`

2. Download the models (adapter_config.json && adapter_model.safetensors) from Michael/Jun Yu.
   Copy it over to backend_local directory, with both models under the folder "models/"

3. Create a virtual environment

## if Execution Error during starting of env

Set-ExecutionPolicy Unrestricted -Scope Process

### `python -m venv venv`

4. Activate the virtual environment

### `\venv\Scripts\activate`

5. Install the requirements for the environment

### pip install torch==2.3.1+cu118 torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu118

6. Install torch with cuda first

### `pip install -r requirements.txt`

7. Run the backend file main.py to start the local server
   Make sure to run it under the environment created.

### Ensure Firebase Access key is in folder and saved as serviceAccountKey

### `python main.py`

8. Now you can access the backend server. You can try out in postman.
   The main backend has is under /api/mcq with POST type, requesting JSON file under {"notes":"..."}

## Consequent Time Running

When you have installed everything initially, follow **steps 4-6** above to ensure python libraries are installed.
