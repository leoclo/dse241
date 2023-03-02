import pandas as pd

def excel2csv():
    df = pd.read_excel('estacas-1.xlsx', names=['latitude', 'longitude', 'diameter_mm', 'length_cm_drilled', 'length_cm_concrete', 'date'])
    df.to_csv('piles-1.csv')
    df = pd.read_excel('estacas-2.xlsx', names=['latitude', 'longitude', 'diameter_mm', 'length_cm_drilled', 'length_cm_concrete', 'date'])
    df.to_csv('piles-2.csv')


if __name__ == "__main__":
    excel2csv()
