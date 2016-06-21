# HearthStone Machine Learning

## General presentation

This project is a major part of our studies [*MSC Advanced Computer Science (Computational Intelligence)*] at the University of Kent (United Kingdom).

Subject title: **An application of Machine Learning to the Card Game Hearthstone**.

It is about an AI (Machine Learning system) for card oriented game, applied to the game HearthStone (Blizzard company).

Contributors:

- Maigret Aurélien, original author of the project
- Zajda Florent
- Colin Julien

Supervisor:

- Marek Grzes

## Project presentation

This is an AI project (Machine Learning system) for a card game, applied to the game HearthStone (Blizzard company). Hearthstone is a digital collectible card game (and free-to-play) that revolves around turn-based matches between two opponents. All played with cards that can summon creatures, weapons, spells, secrets, ...

We are interested by both artificial intelligence and the game HearthStone, that is why we would like to make our project of studies about a machine learning system, which will have the ultimate goal of learning cards and combos by itself, and be able to advise the player on what is the best move in every situation.

More information on [docs/Project.md](./docs/Project.md).

## University deadlines

| What you have to do                 | Deadline                |
| ----------------------------------- | ----------------------- |
| Project Registrations Open          | 10am 18th January 2016  |
| Submitted a Project Acceptance Form | 4pm 29th January 2016   |
| Early deliverable                   | 2pm 27th June 2016      |
| Submission of the corpus            | 2pm 25th August 2016    |
| Submission of the dissertation      | 2pm 12th September 2016 |

# Installation

Python 3 and NodeJS are required.

## Application

In the *Application* directory:

```
npm install -g electron-prebuilt
npm install
```

Run the application (*Application* directory):

```
electron .
```

## Update cards data

In the *Application* directory:

```
pip3 install Pillow
python3 fetch_data.py
```

## Decks-Scraping

Python 2 is required.

```
pip2 install lxml
pip2 install requests
```

```
python2 scraping.py
```
