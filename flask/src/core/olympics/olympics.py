from src.settings import settings as ST
import pandas as pd


def get_df():
    df = pd.read_csv('src/core/olympics/olympics.csv')
    df_heatmap = pd.pivot_table(df, values=['Medal'], index=['Year', 'Country', 'City'], aggfunc=len).reset_index()
    df_heatmap = df_heatmap.sort_values(by=['Year', 'Medal'], ascending=False)
    return {'df_heatmap': df_heatmap.to_dict(orient='records')}

