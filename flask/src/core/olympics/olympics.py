from src.settings import settings as ST
import pandas as pd


def get_df_v1():
    df = pd.read_csv('src/core/olympics/olympics.csv')

    df_heatmap = pd.pivot_table(df, values=['Medal'], index=['Year', 'Country', 'City'], aggfunc=len).reset_index()


    df_heatmap = df_heatmap.sort_values(by=['Year', 'Medal'], ascending=False)
    
    return {'df_heatmap': df_heatmap.to_dict(orient='records')}

def get_df():
    df = pd.read_csv('src/core/olympics/olympics.csv')
    df_heatmap = pd.pivot_table(df, values=['Medal'], index=['Year', 'Country', 'Sport', 'City'], aggfunc=len).reset_index()
    df_years = {}
    for year in df['Year'].unique():
        df_year = df_heatmap[df_heatmap['Year'] == year].sort_values(by='Medal', ascending=False)
        # df_year['Medal'] = df_year['Medal'].astype(float)
        df_years[str(year)] = df_year.to_dict(orient='records')
    
    return {'df_heatmap': df_years }