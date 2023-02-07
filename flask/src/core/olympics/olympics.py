from src.settings import settings as ST
import pandas as pd



def get_df():
    df = pd.read_csv('src/core/olympics/olympics.csv')
    
    # filter out countrie with less than 10 medals
    seriesCol = 'Medal'
    valCol = 'Sport'
    df_total = pd.pivot_table(df, values=[valCol], index=['Country'], aggfunc=len).reset_index()
    

    all_countries = df_total.nlargest(10, valCol)['Country'].unique()
    series = list(df[seriesCol].unique())

    all_countries = list(all_countries) 

    loop_years = df['Year'].unique()
    loop_years.sort()
    
    series.sort()
    if 'Gold' in series:
        series = ['Gold', 'Silver', 'Bronze']
    
    df = df[df['Country'].isin(all_countries)]
    
    df_heatmap = pd.pivot_table(df, values=['Medal'], index=['Year', 'Country', 'City'], aggfunc=len).reset_index()
    df_heatmap = df_heatmap.sort_values(by=['Year', 'Country']).to_dict(orient='records')

    df_years = {}
    cum_years = []
    for year in loop_years:
        cum_years.append(year)
        df_year = df[df['Year'].isin(cum_years)]
        for y in cum_years:
            if y != year:
                df_year = df_year.replace(to_replace={'Year': {y: year}})

        df_year = pd.pivot_table(df_year, values=[valCol], index=['Year', 'Country', seriesCol], aggfunc=len).reset_index()

        countries = pd.pivot_table(df_year, values=[valCol], index=['Country'], aggfunc=sum).sort_values(by=valCol, ascending=False).index.tolist()

        df_years[str(year)] = {}
        df_years[str(year)]['countries'] = [*countries, *[c for c in all_countries if c not in countries]]

        for serie in series:
            df_years[str(year)][serie] = {}
            df_serie = df_year[df_year[seriesCol] == serie]
            if df_serie.shape[0]:
                df_years[str(year)][serie] = df_serie.to_dict(orient='records')
            else:
                df_years[str(year)][serie] = []

    return {
        'bar': {'df': df_years, 'series': series, 'all_countries': all_countries }, 
        'heatmap': {'df': df_heatmap, 'all_countries': all_countries} 
    }