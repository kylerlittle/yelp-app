#!/bin/bash

# Declare output file.
OUTPUTFILE=CraKeN_TableSizes.txt

# Set password
export PGPASSWORD='12345';

# Truncate file
echo -n "" > $OUTPUTFILE

psql CraKeN_YelpDB -tAc "\dt" | \
while read i
do
    match=`echo $i | perl -nle 'print $1 if m{.+\|\K(.+)(?=\|.+\|\w)}'`
    if [[ match ]]; then
        echo -n "$match table size: " >> $OUTPUTFILE
        psql CraKeN_YelpDB -tAc "SELECT COUNT(*) FROM $match" >> $OUTPUTFILE
    else
        echo "$i doesn't match"
    fi
done
