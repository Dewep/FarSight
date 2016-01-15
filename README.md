# HearthStone Machine Learning

## General presentation

This project is a major part of our studies [*MSC Advanced Computer Science (Computational Intelligence)*] at the University of Kent (United Kingdom).

It is about an IA (Machine Learning system) for card oriented game, applied to the game HearthStone (Blizzard company).

Contributors:

- Maigret Aurélien, original author of the project
- Zajda Florent

Supervisor:

- *To define*

## Project presentation

*TODO: Short presentation*

More information on [docs/Project.md](./docs/Project.md).

## University deadlines

| What you have to do                 | Deadline                |
| ----------------------------------- | ----------------------- |
| Project Registrations Open          | 10am 18th January 2016  |
| Submitted a Project Acceptance Form | 4pm 29th January 2016   |
| Early deliverable                   | 2pm 27th June 2016      |
| Submission of the corpus            | 2pm 25th August 2016    |
| Submission of the dissertation      | 2pm 12th September 2016 |

## Our roadmap

| Steps                               | Release date            |
| ----------------------------------- | ----------------------- |
| Creation of the project             | January 2016            |
| Fetch HS data and simulate a game   | February 2016           |
| Machine Learning simple deck        | March 2016              |
| GUI live game                       | April 2016              |
| Multiple decks                      | May-June 2016           |
| General machine learning            | July-August 2016        |

### Step 1: Creation of the project (January 2016)

- Writing documentations/presentations of the project
    - Moodle page: [CO880: Project and Dissertation](https://moodle.kent.ac.uk/2015/course/view.php?id=797)
    - [Project information for Students](https://moodle.kent.ac.uk/2015/mod/page/view.php?id=86182)
    - HearthStone protocol
- Find a supervisor
    - [School staff pages](http://www.cs.kent.ac.uk/people/staff/)
    - [Prof Alex Freitas](http://www.cs.kent.ac.uk/people/staff/aaf/index.html) - *Professor of Computational Intelligence*
- Register the project

### Step 2: Fetch HS data and simulate a game (February 2016)

- Discovery of HearthStone protocol
    - Log files (particulary the *Power.log* in the directory `C:\Program Files (x86)\Hearthstone\Logs\`)
    - Other possibility, network packets: [Hearthy](https://github.com/HearthSim/Hearthy)
- Fetching, parsing and interpreting HearthStone live data
    - Possible implementation with the log files: [hearthstone.hslog](https://github.com/HearthSim/python-hearthstone/tree/master/hearthstone/hslog)
- Game simulator
    - [Fireplace](https://github.com/jleclanche/fireplace)
    - [Hearthbreaker](https://github.com/danielyule/hearthbreaker)

### Step 3: Machine Learning simple deck (March 2016)

- Creation of a basic deck
    - Basic paladin aggro
- Machine Learning (our IA vs our IA, with the same deck) using the simulation system
    - *IAMDINOSAUR*: [GitHub](https://github.com/ivanseidel/IAMDinosaur) / [YouTube explanation](https://www.youtube.com/watch?v=P7XHzqZjXQs)
    - [Hearthbreaker](https://github.com/danielyule/hearthbreaker)
- Calculation of the percentage of winning the game

### Step 4: GUI live game (April 2016)

- IA vs real player (always with the same deck) during a real game (fetch live data)
- GUI printing advices/options to the player
    - With the Tk library: [POC](./POC/)
- Improvement of the IA

### Step 5: Multiple decks (May-June 2016)

- Creation of other decks
- Machine Learning of other decks
- Detection of the enemy deck

### Step 6: General machine learning (July-August 2016)

- Writing our reports
    - [Project information for Students](https://moodle.kent.ac.uk/2015/mod/page/view.php?id=86182)
- Creation of decks in live
- Machine Learning in live
