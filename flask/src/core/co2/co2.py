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