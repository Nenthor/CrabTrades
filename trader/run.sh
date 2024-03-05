# Make me executable! chmod +x run.sh

# Guide Install TensorFlow on Debian 11: https://kifarunix.com/install-tensorflow-on-debian/

VENV_NAME="tensorflow_env"
notebook_file="notebook.ipynb"

python3 -V # TensorFlow requires Python 3.7+

# Check if the virtual environment exists
if [ ! -d "$VENV_NAME" ]; then
    # Create the virtual environment if it doesn't exist
    python3 -m venv "$VENV_NAME"
fi

# Activate the virtual environment
source "$VENV_NAME/bin/activate"

pip --version # pip version 19.0 or higher is required

# Check and install necessary dependencies
while read -r line || [[ -n "$line" ]]; do
    package=$(echo "$line" | cut -d '=' -f 1)  # Extract package name
    if ! pip show "$package" &> /dev/null; then
        # Install the package if it's not installed
        pip install "$line"
    fi
done < ./requirements.txt

# Convert the notebook to a script if it doesn't exist
if [ ! -e main.py ]; then
    # Install the package if it's not installed
    if ! pip show jupyter &> /dev/null; then
        pip install jupyter
    fi

    jupyter nbconvert --to script --output main "$notebook_file"
fi

# Run script
python main.py

# Deactivate the virtual environment
deactivate