import json
import geojson
import numpy as np
import os
import re
import turfpy
import pandas as pd
from unidecode import unidecode
from turfpy.measurement import boolean_point_in_polygon
from turfpy.transformation import circle as turf_circle


# --- ENDPOINT CALLS ---


def get_df():
    base_path = 'src/core/piles'

    
    df = pd.read_csv(f'{base_path}/data/piles_with_places.csv')
    df['pile_volume_cubic_meters'] = df.apply(cylinder_volume, axis=1)
    
    df = df.pivot_table(index=['admin1'], values=['pile_volume_cubic_meters'], aggfunc=sum).reset_index()
    with open(f'{base_path}/geojsons/brazil_admin1_clean.json', 'r') as json_file:
        return {
            'custom': {'df': df.to_dict(orient='records')},
            'geojson': json.load(json_file)
        }


# --- UTILS ---


def cylinder_volume(row):
    r = row['diameter_mm'] / 2000 # convert mm to m and get the radius
    h = row['length_cm_drilled'] / 100 # convert cm to m and get the height
    return np.pi * r ** 2 * h


def name2code(name):
    new_name = re.sub(r'[^\w\s]', '-', unidecode(name))
    return re.sub(r'\s+', '-', new_name).lower()


def mkdir(path):
    if not os.path.exists(path):
        os.mkdir(path)


def rm_file(path):
    if os.path.exists(path):
        os.remove(path)


def write_json(path, feature):
    with open(path, 'w') as file:
        json.dump(feature, file)


def excel2csv():
    df_1 = pd.read_excel('data/estacas-1.xlsx', names=['latitude', 'longitude', 'diameter_mm', 'length_cm_drilled', 'length_cm_concrete', 'date'])
    # df.to_csv('piles-1.csv')
    df_2 = pd.read_excel('data/estacas-2.xlsx', names=['latitude', 'longitude', 'diameter_mm', 'length_cm_drilled', 'length_cm_concrete', 'date'])
    df = pd.concat([df_1, df_2]).reset_index()
    df.to_csv('data/piles.csv')


# --- GEOJSON MANIPULATIONS ---


def admin2geojson_breakdown():
    # simply add name to proerties for echarts
    mkdir('geojsons/admin2_clean')
    city_admin2geojson = {}
    with open('geojsons/brazil_admin1.json', 'r') as json_file:
        country_admin1geojson = {
            'type': 'FeatureCollection',
            'features': []
        }
        for f in json.load(json_file)['features']:
            code_name = name2code(f['properties']['name_1'])
            new_f = {
                **f, 
                'properties': {
                    'name_0': f['properties']['name_0'],
                    'name_1': f['properties']['name_1'],
                    'name': code_name
                }
            }
            country_admin1geojson['features'].append(new_f)
            city_admin2geojson[code_name] = {
                'type': 'FeatureCollection',
                'features': []
            }

        
        write_json('geojsons/brazil_admin1_clean.json', country_admin1geojson)

    #  breakdown in folders by state for focus loading
    
    with open('geojsons/brazil_admin2.json', 'r') as json_file:
        for f in json.load(json_file)['features']:
            code_name = name2code(f['properties']['name_1'])
            code_name2 = name2code(f['properties']['name_2'])
            new_f = {
                **f,
                'properties': {
                    'name_0': f['properties']['name_0'],
                    'name_1': f['properties']['name_1'],
                    'name_2': f['properties']['name_2'],
                    'name': code_name2
                }
            }
            city_admin2geojson[code_name]['features'].append(new_f)

    for k, v in city_admin2geojson.items():
        mkdir(f'geojsons/admin2_clean/{k}')
        write_json(f'geojsons/admin2_clean/{k}/{k}.json', v)

    return None


def get_feature_from_point(point, features):
    for f in features:
        if boolean_point_in_polygon(point, f['geometry']):
            return f['properties']['name']
    return None


def create_feature_from_point(point, name_ix=0, radius_km=1):
    circle = turf_circle(center=geojson.Feature(geometry=point), radius=radius_km, units='km')
    circle['properties'] = {
        'name': f'area-{name_ix+1}'
    }
    return circle

def piles_final_geojson_manip():
    """
        Assigns admin1, admin2, and 1.6km work-area-circle for city
    """
    df = pd.read_csv('data/piles.csv').drop(columns=['Unnamed: 0'])
    # column_country
    geojsons = {}
    centers = {}
    with open('geojsons/brazil_admin1_clean.json', 'r') as json_file:
        geojsons['brazil'] = json.load(json_file)['features']
    
    new_rows = []
    for index, row in df.iterrows():
        
        point = geojson.Point((row['longitude'], row['latitude']))
        admin1 = get_feature_from_point(point, geojsons['brazil'])
        if admin1 is None: continue
        if not (admin1 in geojsons):
            with open(f'geojsons/admin2_clean/{admin1}/{admin1}.json', 'r') as json_file:
                geojsons[admin1] = json.load(json_file)['features']
        
        admin2 = get_feature_from_point(point, geojsons[admin1])
        if admin2 is None: continue
        if not ((admin1, admin2) in geojsons):
            geojsons[(admin1, admin2)] = [create_feature_from_point(point)]
            centers[(admin1, admin2)] = (row['longitude'], row['latitude'])
        
        area_name = get_feature_from_point(point, geojsons[(admin1, admin2)])
        if area_name is None:
            geojsons[(admin1, admin2)] = [create_feature_from_point(point, len(geojsons[(admin1, admin2)]))]
            centers[(admin1, admin2)] = (row['longitude'], row['latitude'])
            area_name = get_feature_from_point(point, geojsons[(admin1, admin2)])
        
        new_rows.append({
            **row, 'admin1': admin1, 'admin2': admin2, 'area_name': area_name,
            'center_area_long': centers[(admin1, admin2)][0],
            'center_area_lat': centers[(admin1, admin2)][1]
        })
        print(new_rows[-1])

    pd.DataFrame(new_rows).to_csv('data/piles_with_places.csv', index=False)
    for k, v in geojsons.items():
        if isinstance(k, tuple):
            mkdir(f'geojsons/admin2_clean/{k[0]}/{k[1]}')
            write_json(f'geojsons/admin2_clean/{k[0]}/{k[1]}/areas.json', {'type': 'FeatureCollection', 'features': v})

    return None


if __name__ == "__main__":
    print('Uncomment what you want to run and dont forget to download files in geojsons/info.txt')
    # excel2csv_piles    
    # excel2csv()


    # admin2 geojson to folders
    # admin2geojson_breakdown()

    # piles_final_geojson_manip
    # piles_final_geojson_manip()

