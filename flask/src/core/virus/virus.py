import pandas as pd

def get_df():
    df = pd.read_csv('src/core/virus/West_Nile_Virus_by_County.csv')
    
    df = df.groupby(['Year', 'County'])['Positive_Cases'].sum().reset_index()
    df['Cumulative_Positive_Cases'] = df.groupby('County')['Positive_Cases'].cumsum()

    df = df.sort_values(by=['County', 'Year'])
    df['Positive_Cases'] = df.groupby('County')['Positive_Cases'].apply(lambda x: x.fillna(0))
    df['Cumulative_Positive_Cases'] = df.groupby('County')['Cumulative_Positive_Cases'].apply(
        lambda x: x.fillna(method='ffill').fillna(0)
    )
    
    # All Combinations 
    all_years = pd.DataFrame({'Year': range(df['Year'].min(), df['Year'].max()+1)})
    all_counties = pd.DataFrame({'County': df['County'].unique()})
    all_combinations = all_years.assign(key=1).merge(all_counties.assign(key=1), on='key').drop('key', axis=1)

    #  Merge
    df = all_combinations.merge(df, on=['Year', 'County'], how='left')
    df['Positive_Cases'] = df['Positive_Cases'].fillna(0)
    df['Cumulative_Positive_Cases'] = df.groupby('County')['Cumulative_Positive_Cases'].ffill().fillna(0)

    # prepare to Js
    loop_years = df['Year'].unique()
    df_years = {}
    for year in loop_years:
        df_years[str(year)] = df[df['Year'] == year].to_dict(orient='records')
    
    return {
        'geo_heatmap': {'df': df_years, 'valColName': 'Cumulative_Positive_Cases', 'locColName': 'County'}
    }