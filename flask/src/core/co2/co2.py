import pandas as pd


def get_df():
    df = pd.read_csv('src/core/co2/co2-population.csv')
    df_co2 = df[
        df['Sector'].isin(['Commercial', 'Industrial', 'Residential', 'Transportation', 'Electric Power'])
    ]
    df_co2['Value'] = pd.to_numeric(df_co2['Value'])

    df_co2 = df_co2.pivot_table(
        index=['State'],
        values=['Value'],
        aggfunc=sum
    ).reset_index()
    
    return {'map': {'df': df_co2.to_dict(orient='records'), 'valColName': 'Value', 'locColName': 'State'}}


def get_df_spec(spec):
    df = pd.read_csv('src/core/co2/co2-population.csv')
    
    series = ['Electric Power', 'Transportation', 'Industrial',  'Residential', 'Commercial']
    df_co2 = df[
        df['Sector'].isin(series)
    ].sort_values('Year')
    

    df_co2['Value'] = pd.to_numeric(df_co2['Value'])
    if spec != 'US':
        df_co2 = df_co2[df_co2['State'] == spec]

    xAxisData = df_co2['Year'].drop_duplicates().to_list()

    # df_co2 = df_co2.sort_values('Sector')
    # series = df_co2['Sector'].drop_duplicates().to_list()
    
    df_series = {}
    for serie in series:
        df_series[serie] = df_co2[df_co2['Sector'] == serie].pivot_table(
            index=['Year'],
            values=['Value'],
            aggfunc=sum
        ).reset_index().sort_values(by='Year').to_dict(orient='records')
    
    return {
        'line': {
            'df_series': df_series,
            'valColName': 'Value',
            'xColName': 'Year',
            'series': series,
            'xAxisData': xAxisData,
            'spec': spec
        }
    }