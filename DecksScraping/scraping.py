#!/usr/bin/python

from lxml import html
import requests
import json
import sys

# Constants.
URL = 'http://www.hearthpwn.com'
CLASSES = {
    "Druid"   : 4,
    "Hunter"  : 8,
    "Mage"    : 16,
    "Paladin" : 32,
    "Priest"  : 64,
    "Rogue"   : 128,
    "Shaman"  : 256,
    "Warlock" : 512,
    "Warrior" : 1024 }

# Settings.
DECK_AGE = {
    "Top - Week" : 3,
    "Top - Month" : 4,
    "Top - All Time" : 5 }["Top - Month"]
NB_DECK_BY_CLASS = 10

# Misc.
def flat(myList): # Array 2D -> 1D
    return [it for sub in myList for it in sub]

# Id of cards are stored in an external JSON file (to match cardName-cardID).
cardsJson = []
with open('cards.json') as data_file:
    cardsJson = json.load(data_file)

basicsDecksJson = []
with open('decks.json') as data_file:
    basicsDecksJson = json.load(data_file)


def getIdOfCard(cardName):
    element = [x for x in cardsJson if x['name'] == cardName][0]
    return element['id'].encode('ascii')

# Scraping.
decks = []
for className, classId in CLASSES.iteritems():
    print 'Processing', className

    for d in basicsDecksJson[className.upper()]:
        print "Deck :", d["url"]

        cardsPage = requests.get(d["url"])
        XMLTreeCardsPage = html.fromstring(cardsPage.content)
        XMLCards = XMLTreeCardsPage.xpath('//aside//tbody//a//text()')
        XMLCards = [item.strip() for item in XMLCards]
        XMLCardsMultipliers = XMLTreeCardsPage.xpath('//aside//tbody//td[@class="col-name"]/text()')
        XMLCardsMultipliers = [int(x[-1]) for x in filter(bool, [x.strip() for x in XMLCardsMultipliers])]

        decks.append({
            'id' : len(decks) + 1,
            'name' : d["name"],
            'class' : className,
            'advices' : d["advices"],
            'cards' : flat([x * [getIdOfCard(y)] for x, y in zip(XMLCardsMultipliers, XMLCards)])
            })
        if (len(decks) % NB_DECK_BY_CLASS == 0):
            break

# for className, classId in CLASSES.iteritems():
#     print 'Processing', className
#     print URL + '/decks?filter-deck-tag=' + str(DECK_AGE) + '&sort=-rating&filter-class=' + str(classId)

#     page = requests.get(URL + '/decks?filter-deck-tag=' + str(DECK_AGE) + '&sort=-rating&filter-class=' + str(classId))
#     XMLtree = html.fromstring(page.content)
#     XMLdecks = XMLtree.xpath('//span[@class="tip"]/a')

#     for XMLdeck in XMLdecks:
#         print "Deck :", URL + XMLdeck.attrib['href']

#         cardsPage = requests.get(URL + XMLdeck.attrib['href'])
#         XMLTreeCardsPage = html.fromstring(cardsPage.content)
#         XMLCards = XMLTreeCardsPage.xpath('//aside//tbody//a//text()')
#         XMLCards = [item.strip() for item in XMLCards]
#         XMLCardsMultipliers = XMLTreeCardsPage.xpath('//aside//tbody//td[@class="col-name"]/text()')
#         XMLCardsMultipliers = [int(x[-1]) for x in filter(bool, [x.strip() for x in XMLCardsMultipliers])]

#         decks.append({
#             'id' : len(decks),
#             'name' : XMLdeck.text,
#             'class' : className,
#             'cards' : flat([x * [getIdOfCard(y)] for x, y in zip(XMLCardsMultipliers, XMLCards)])
#         })
#         if (len(decks) % NB_DECK_BY_CLASS == 0):
#             break

# Formatting to fill our database scheme.
result = {
    'decks_properties' : [{ 'id'   : x['id'],
                            'hero' : x['class'],
                            'advices' : x['advices'],
                            'name' : x['name']} for x in decks],
    'decks_instances'  : [{ 'deck': x['id'],
                            'cards': x['cards']} for x in decks]
}

with open('output.json', 'w') as outfile:
    json.dump(result, outfile, indent=4, sort_keys=True)
