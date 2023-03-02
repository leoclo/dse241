import pandas as pd


def get_df():
    df_age = pd.read_csv('src/core/sheep/sheep_age.csv')
    df_age['name'] = df_age['id'].apply(lambda sheep_id: f'Sheep {sheep_id}')
    df_age['id'] = df_age['id'].apply(lambda x: x-1)
    nodes = df_age.rename(columns={'age': 'value'}).to_dict(orient='records')

    df_edges = pd.read_csv('src/core/sheep/sheep_edges.csv')
    df_edges['source'] = df_edges['source'].apply(lambda x: x-1)
    df_edges['target'] = df_edges['target'].apply(lambda x: x-1)
    edges = df_edges.rename(columns={'weight': 'value'}).to_dict(orient='records')
    

    return {'graph': {'edges': edges, 'nodes': nodes}}