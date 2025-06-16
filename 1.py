
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer


movies=pd.read_csv("dataset.csv")
movies
movies.head()

movies.isnull().sum()

movies.columns


cv=CountVectorizer(max_features=10000, stop_words='english')

cv

vector=cv.fit_transform(movies['genre'].values.astype('U')).toarray()




