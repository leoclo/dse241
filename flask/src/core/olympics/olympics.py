from src.settings import settings as ST
import pandas as pd


def get_heatmap_df():
    df = pd.read_csv('src/core/olympics/olympics.csv')

    df_heatmap = pd.pivot_table(df, values=['Medal'], index=['Year', 'Country', 'City'], aggfunc=len).reset_index()

    df_heatmap = df_heatmap.sort_values(by=['Year', 'Medal'], ascending=False)
    return {'df_heatmap': df_heatmap.to_dict(orient='records')}

def get_df():
    df = pd.read_csv('src/core/olympics/olympics.csv')
    
    # filter out countrie with less than 10 medals
    seriesCol = 'Medal'
    valCol = 'Sport'
    df_total = pd.pivot_table(df, values=[valCol], index=['Country'], aggfunc=len).reset_index()

    countries = df_total.nlargest(10, valCol)['Country'].unique()
    series = list(df[seriesCol].unique())

    countries = list(countries) 

    loop_years = df['Year'].unique()
    loop_years.sort()
    
    series.sort()
    if 'Gold' in series:
        series = ['Gold', 'Silver', 'Bronze']
    
    df = df[df['Country'].isin(countries)]
    
    # df = pd.pivot_table(df, values=[valCol], index=['Year', 'Country', seriesCol, 'City'], aggfunc=len).reset_index()
    df_years = {}
    cum_years = []
    for year in loop_years:
        cum_years.append(year)
        df_year = df[df['Year'].isin(cum_years)]
        for y in cum_years:
            if y != year:
                df_year = df_year.replace(to_replace={'Year': {y: year}})
        # df_year = df.replace(to_replace={'Year': {y: year for y in cum_years }})
        df_year = pd.pivot_table(df_year, values=[valCol], index=['Year', 'Country', seriesCol], aggfunc=len).reset_index()
        
        df_years[str(year)] = {}

        for serie in series:
            df_years[str(year)][serie] = {}
            df_serie = df_year[df_year[seriesCol] == serie]
            if df_serie.shape[0]:
                df_years[str(year)][serie] = df_serie.to_dict(orient='records')

            else:
                df_years[str(year)][serie] = []

    return {'bar': {'df': df_years, 'countries': countries, 'series': series }, 'df_heatmap': {} }