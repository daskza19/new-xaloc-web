import pandas as pd

df = pd.read_csv("output_con_diferencia.csv")

# Convertir la columna a timedelta
df["diferencia"] = pd.to_timedelta(df["diferencia"])

promedio = df["diferencia"].mean()

print("Tiempo promedio de resolución:", promedio)