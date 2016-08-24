# Description: Reload our local copy of all existing Heartstone cards.
# Author: Julien

#!/bin/bash

# Update cards list
curl https://api.hearthstonejson.com/v1/latest/enUS/cards.json > cards.json
