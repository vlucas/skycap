#!/bin/bash

# Save current directory location
SKYCAP_DIR=`pwd`

# PostgreSQL Adapter
cd ./node_modules/skycap-adapter-pg;
knex migrate:latest;
knex seed:run;
cd $SKYCAP_DIR; # back home...

# REPEAT for each adapter type...
