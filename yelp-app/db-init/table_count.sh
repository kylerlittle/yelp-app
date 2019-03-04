# Declare output file.
OUTPUTFILE=CraKeN_TableSizes.txt

# Ugly hack is ugly :'(
REGEX='((.+)\|)((.+)\|)((.+)\|\w)'

psql CraKeN_YelpDB -tAc "\dt" | \
while read i
do
    if [[ $i =~ $REGEX ]]; then
        psql CraKeN_YelpDB -tAc "SELECT COUNT(*) FROM ${BASH_REMATCH[4]}" >> $OUTPUTFILE
    else
        echo "$i doesn't match"
    fi
done
