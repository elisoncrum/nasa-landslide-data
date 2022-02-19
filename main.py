import csv
import json
from datetime import datetime

FILENAME = "data/Global_Landslide_Catalog_Export.csv"
TIMEFORMAT = '%m/%d/%Y %I:%M:%S %p'

count_by_country = {}
count_by_trigger = {}
total_by_year = {}
count_by_size = {}

heatmap = {}

timeline = {
    "total":{},
    "deaths": {},
    "trigger": {}
}
with open(FILENAME, 'r', encoding="utf8") as stream:
    reader = csv.DictReader(stream)

    for row in reader:

        # map data
        country = row["country_name"]
        trigger = row["landslide_trigger"]
        size = row["landslide_size"]
        date = row["event_date"]

        date = datetime.strptime(date, TIMEFORMAT)

        if country == "United States": country = "United States of America"
        if country in count_by_country:
            count_by_country[country] += 1
        else:
            count_by_country[country] = 1

        if trigger in count_by_trigger:
            count_by_trigger[trigger] += 1
        else:
            count_by_trigger[trigger] = 1

        YEAR = datetime.strptime("{}".format(date.year), "%Y")
        if YEAR in total_by_year:
            total_by_year[YEAR]["landslides"] += 1
        else:
            total_by_year[YEAR] = {"landslides": 1, "deaths": 0}

        if row["fatality_count"]:
            total_by_year[YEAR]["deaths"] += int(row["fatality_count"])
        
        if not size: size = "Unkown"
        if size in count_by_size:
            count_by_size[size] += 1
        else:
            count_by_size[size] = 1
        
        DAY_TO_YEAR = date.timetuple().tm_yday
        MONTH_DAY = date.strftime("%m-%d")
        _date = datetime.strptime("2000-{}-{}".format(date.month, date.day), "%Y-%m-%d")
        y = _date.weekday()
        x = _date.isocalendar().week

        if (x, y) in heatmap:
            heatmap[(x, y)] += 1
        else:
            heatmap[(x, y)] = 1
        #if row["longitude"] and row["latitude"] and row["event_title"]:
        #    lat_long_stat.append(
        #        {
        #            "name": row["event_title"],
        #            "lat": float(row["latitude"]),
        #            "lon": float(row["longitude"])
        #        }
        #    )

heatmap = [[k[0], k[1], v] for k, v in heatmap.items()]
print(heatmap)


count_by_country = [ {"name": x, "value": v} for x, v in count_by_country.items()]
count_by_trigger = [ {"name": x.replace("_", " ").title(), "y": v} for x, v in count_by_trigger.items()]
stat_by_year = [ [str(m), v["landslides"]] for m, v in total_by_year.items()]
stat_by_year.sort(key=lambda date: int(date[0].split("-")[0]))

total_death_by_year = [ [str(m), v["deaths"]] for m, v in total_by_year.items()]
total_death_by_year.sort(key=lambda date: int(date[0].split("-")[0]))

count_by_size = {
    "keys": [x.replace("_", " ").title() for x in count_by_size.keys()],
    "values": list(count_by_size.values())
}

with open('data/map.json', 'w') as outfile:
    json.dump(count_by_country, outfile)

with open('data/trigger.json', 'w') as outfile:
    json.dump(count_by_trigger, outfile)

with open('data/timeline.json', 'w') as outfile:
    json.dump(stat_by_year, outfile)

with open('data/timeline-deaths.json', 'w') as outfile:
    json.dump(total_death_by_year, outfile)

with open('data/size.json', 'w') as outfile:
    json.dump(count_by_size, outfile)

with open('data/heatmap.json', 'w') as outfile:
    json.dump(heatmap, outfile)

#with open('data/coords.json', 'w') as outfile:
#    json.dump(lat_long_stat, outfile)