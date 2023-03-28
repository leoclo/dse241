# dse241 Visualization Project


# Introduction

The ``dse241`` project goal is to create a self-contained dockerized application with the main projects developed along the course.

docker-compose up -d


##  Local Installation
---

Clone the repository or download the .zip file and extract it on the desired directory


### Docker
---

On the root folder of the project run the following command:

```bash
docker-compose up -d
```


### Bash
---

#### Backend Flask Api
---

On the ./flask folder create a virtual environment with the command

```bash
python -m venv venv
```

Activate the created enviroment

```bash
source venv/bin/activate
```

Install the requirements for the project

```bash
pip install -r requirements.txt
```

Run the api

```bash
python api.py
```

#### Fronted Vue Vite Application
---

On the ./vue-app folder install npm packages with

```bash
npm install
```

Once it's finished start the application with the following command

```bash
npm run dev
```

#### Piles pre-processing

Uncomment what you want to run on the file flask/src/core/piles/piles.py

With the activated enviroment and on path flask/src/core/piles

Run

```bash
python piles.py
```

## Usage
---

When everything is running:

Navigate to http://localhost:5173/olympics in your browser to see the visualization created for the Olympic Games Asssignment

Navigate to http://localhost:5173/co2 in your browser to see the visualization created for the Carbon Emissions Assignment

Navigate to http://localhost:5173/sheep in your browser to see the visualization created for the Sheep Visualization assignment

Navigate to http://localhost:5173/virus in your browser to see the visualization created for the Virus Visualization assignment

Navigate to http://localhost:5173/piles in your browser to see the visualization created for the Virus Visualization assignment

