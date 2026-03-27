## Installing dependencies
```
pip install -r requirements.txt
```

### MacOS
```
brew install libmagic inkscape
```
### Ubuntu
```
sudo apt install libmagic-dev inkscape
```
### Windows
```
pip install python-magic-bin
```
Install inkscape: https://inkscape.org/release

## Running locally
up localstack
```
cd tests
docker-compose up -d
```

running api
```
export PYTHONPATH=$projectDir
cd api
flask run
```

# Testes no Pycharm
* Alterar o Settings > Tools > Python Integrated Tools > Default test runner para unittests

# Rodar o treinamento do smart search localmente
```
export OPENAI_API_KEY=[YOUR_OPENAI_API_KEY]
export WANDB_PROJECT="smart-search"
export RESOURCE_HOST=localhost
export RESOURCE_PASS=kyrix
export RESOURCE_USER=kyrix
export RESOURCE_DB=kyrix
```

## Subir o banco de treinamento local
```
./init_database.sh
```